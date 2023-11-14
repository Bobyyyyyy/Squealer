const mongoose = require('mongoose');
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Channel = require("../schemas/Channel")
const ReservedChannel = require("../schemas/officialChannels");
const {connectdb, createError, mongoCredentials,find_remove} = require("./utils");
const {scheduledPostArr, getNextTick} = require("../controllers/utils");
const nodeCron = require("node-cron");

/**
 *
 * @param {String} username
 * @returns {Promise<[{reaction}]>}
 */
const getReactionLast30days = async(username) => {
    try{
        await connectdb(mongoCredentials);
        let posts_id_reactions = await Post.find({owner: username, 'destination.destType': {$not: {$eq:'user'}}},'reactions');
        await mongoose.connection.close();

        let now = new Date();
        let last30daysTS = (new Date(now.setDate(now.getDate() - 30))).getTime();

        let reactions = [];

        posts_id_reactions.forEach((post) => {
            post.reactions.forEach((reac) => {
                if(reac.date.getTime() >= last30daysTS) reactions.push(reac);
            })
        })

        return reactions;

    }catch (e) {
        throw e;
    }
}
/**
 *
 * @param {String} username
 * @param {String} onlyThisMonth - get frequency of this month - Dovrebbe essere booleano, da aggiustare
 * @returns {Promise<[String]>} - String are Dates
 */
const getPostsDate = async (username, onlyThisMonth ) => {
    try{

        await connectdb(mongoCredentials);

        let postsId_Date = await Post.find({owner: username},'dateOfCreation');

        await mongoose.connection.close();

        let postsDate = []
        let thisMonth = new Date().getMonth();
        postsId_Date.forEach(obj => {
            if (onlyThisMonth === 'false' || (onlyThisMonth && parseInt(obj.dateOfCreation.getMonth()) === thisMonth)) {
                postsDate.push(obj.dateOfCreation);
            }
        })

        return postsDate;
    }
    catch (err){
        throw err;
    }
}

/**
 *
 * @param {ObjectId} postId
 */
const updateScheduledPost = ( postId) => {
    let idx = scheduledPostArr.findIndex(el =>  el['id']===postId );
    scheduledPostArr[idx].done += 1;
    if(scheduledPostArr[idx].done === scheduledPostArr[idx].allTimes) {
        removeScheduledPost(postId);
    }
    else{
        scheduledPostArr[idx].job.stop();
        scheduledPostArr[idx].job = nodeCron.schedule(getNextTick(scheduledPostArr[idx].timestamp2next), async () => await addTimedPost(postId, mongoCredentials), {scheduled: false})
        scheduledPostArr[idx].job.start();
    }

}


/**
 *
 * @param {ObjectId} postId
 */
const removeScheduledPost = (postId) => {
    let jobDel = find_remove(scheduledPostArr,postId);
    jobDel.job.stop();
}

const sorts = {
    'più recente':{
        dateOfCreation: -1
    },
    'meno recente':{
        dateOfCreation: 1
    },
    'più visual':{
        views: -1
    },
    'meno visual':{
        views: 1
    }
}

function parseText(squealText, squealNumber){
    let specialWords = squealText.match(/\{[A-Z]+}/g);
    if(specialWords){
        let currentDate = new Date().toDateString();
        let currentTime = new Date().toLocaleTimeString('it-IT');
        specialWords.forEach(el => {
            switch (el) {
                case '{NUM}':
                    squealText = squealText.replaceAll(el, squealNumber)
                    break;
                case '{TIME}':
                    squealText = squealText.replaceAll(el, currentTime)
                    break;
                case '{DATE}':
                    squealText = squealText.replaceAll(el, currentDate)
                    break;
                default:
                    break;
            }
        })
    }
    return squealText;
}

const addTimedPost = async (postId, credentials) => {
    try {
        await connectdb(credentials);

        let post = await Post.findById(postId);
        let userQuota = (await User.findOne({username: post.owner})).characters;

        await mongoose.connection.close();

        let timedInfo = scheduledPostArr.find(el => el['id']===postId);


            /* same structure of body passed in addPost */
        let newPost = {
            creator: post.owner,
            destinations: post.destinationArray,
            contentType: post.contentType,
            dateOfCreation: Date.now(),
            content: post.contentType === 'text' ? parseText(timedInfo.content,timedInfo.done + 1) : post.content
        }


        let quota2del = newPost.destType === 'user' ? 0 : (post.contentType === 'text' ? newPost.content.length : 125);
        //GESTIRE CASI IN CUI NON PUO' INSERIRE
        let id = await addPost(newPost, {
                daily: userQuota.daily - quota2del,
                weekly: userQuota.weekly - quota2del,
                monthly: userQuota.monthly - quota2del}
            , credentials);

        //check se id restituisce errore;

        updateScheduledPost(postId);

        return {newPostId : id};

    }catch (err) {
        console.log(err);
    }
}

/**
 * @param {Object} post
 * {creator: String, destination: array of objects{name: String, destType: String}, contentType: String, content: String, dateOfCreation: Date }
 * @param {Object} quota - {daily,weekly-monthly} - remaining updated
 * @param credentials - mongo credentials
 * @returns {Promise<{postId: *}>}
 */
const addPost = async (post,quota,credentials) => {
    try{
        await connectdb(credentials)
        let destinations = (post.destinations instanceof String) ? JSON.parse(post.destinations) : post.destinations;
        let postCategory = 'private';
        let officialChannels = [];
        let creatorType = (await User.findOne({username: post.creator}, 'typeUser')).typeUser;
        for (const destination of destinations) {
            let destinationType = destination.destType;
            let channel = await Channel.findOne({name: destination.name});

            /* ERROR HANDLING */
            /* utente non esiste  */
            if (destinationType === 'user' && !(await User.findOne({username: destination.name}))) {
                await mongoose.connection.close();
                throw createError("utente non esistente!", 422);
            }
            /* canale non esiste  */
            else if (destinationType === 'channel' && channel.length === 0) {
                await mongoose.connection.close();
                throw createError("canale non esistente!", 422);
            }
            /* canale ufficiale non esiste e l'utente non mod*/
            else if (destinationType === 'official' && (!(await ReservedChannel.findOne({name: destination.name}))
                || creatorType !== 'mod')) {
                await mongoose.connection.close();
                throw createError("canale ufficiale non esistente o utente non moderatore!", 422);
            }
            /* tipo di destinatario non inserito */
            else if (destinationType === 'receiver') {
                await mongoose.connection.close();
                throw createError("Inserisci il tipo di destinatario!", 422);
            }

            if (destinationType === 'official') {
                postCategory = 'public';
                officialChannels.push(destination.name);
                destinations.pop(destination);
            }
            else if (channel) {             //null se la findOne non trova nulla
                if (channel.isPublic) {
                    postCategory = 'public';
                }
            }
        }

        /* POST SAVE */
        let newPost = new Post({
            owner: post.creator,
            destinationArray: destinations,
            contentType: post.contentType,
            content: (post.timed && post.contentType === 'text') ? parseText(post.content, 1) : post.content,
            reactions: [],
            officialChannelsArray: officialChannels,
            category: postCategory,
            dateOfCreation: post.dateOfCreation,
        })

        await newPost.save();

        console.log(quota);

        /* QUOTA UPDATE */
        await User.findOneAndUpdate({username: post.creator}, {
            characters:{
                daily: quota.daily,
                weekly: quota.weekly,
                monthly: quota.monthly,
            }
        } );

        await mongoose.connection.close();

        return {postId: newPost._id};
    }
    catch(err){ throw err; }
}

/**
 *
 * @param {Object} query
 * @param {String} query.name - name of user requesting
 * @param {String} query.channel - name of channel
 * @param {Boolean} query.smm - is SMM requesting
 * @param {String} query.destType - only if destType activated
 * @param {String} query.typeFilter - only if type post filter activated
 * @param {Number} query.offset - offset to skip
 * @param {String} query.limit - max number of post to return
 * @param {String} query.sort - only if Sort activated -- more recent by default
 * @param credentials
 * @returns {Promise<*>}
 */
const getAllPost = async (query,credentials) =>{
    try{

        await connectdb(credentials)

        let filter = {
                /* Per i canali non mi serve l'id dell'utente che fa la richiesta, a meno che non sia SMM*/
            ...(query.smm || !query.channel) && {'owner':  query.name},
                /* FILTRO PER TIPO DI POST */
            ... (query.typeFilter && query.typeFilter !== 'all') && {'contentType': query.typeFilter},

                /* PER LA PAGINA DEL PROFILO : */
            ... (query.destType && query.destType !== 'all') && {'destinationArray.destType':  query.destType === 'user' ? 'user' : 'channel'},
            ... (query.destType && query.destType !== 'all' && query.destType !== 'user') && {'category': query.destType},

                /* PER IL CANALE SINGOLO */
            $or: [{...(query.channel) && {'destinationArray.name': query.channel}},
                 {...(query.channel) && {'officialChannelsArray': query.channel}}]
        }


        let posts = await Post.find(filter)
            .skip(parseInt(query.offset))
            .limit(parseInt(query.limit))
            .sort(sorts[query.sort ?  query.sort : 'più recente'])
            .lean();

        for (const post of posts) {
            let views = post.views
            await Post.findByIdAndUpdate(post._id,{'views': ++post.views});
        }

        await mongoose.connection.close()
        return posts;
    }
    catch (err){
        console.log(err);
        throw err;
    }
}

const deletePost = async (body,credentials) => {
    try{
        await connectdb(credentials);

        //controllo se sei il creatore e se esiste il post
        if (!(await Post.findOne({_id: body.id, creator: body.name},'creator').lean())) {
            // se non sei il creatore controlla se sei mod
            if(body.type !== 'mod') {
                let err = new Error("Rimozione non valida");
                err.statusCode = 400;
                throw err;
            }
        }

        let postToDelete = await Post.findByIdAndRemove(body.id).lean();
        await mongoose.connection.close();
        return postToDelete;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}




const updateReac = async (body,credentials) => {
    try{
        await connectdb(credentials);
        let user = await User.findOne({username: body.user},'typeUser');

        if(user.typeUser === 'mod') {
            return await Post.findByIdAndUpdate(body.postId, {$push:{reactions: {$each: JSON.parse(body.reactions)}}});
        }

        let hasReacted = (await Post.findOne({_id : body.postId, reactions:{$elemMatch:{user: body.user}}}));

        if (hasReacted){
            await Post.findByIdAndUpdate(body.postId, {$pull: {reactions: {user: body.user}}});
        }

        await Post.findByIdAndUpdate(body.postId, {$push:{reactions: {rtype: body.reaction, user: body.user, date: new Date()}}});
        await mongoose.connection.close();

        return body;
    }
    catch (err){
        throw err;
    }
}

const deleteReac = async (body,credentials) => {
    try{
        await connectdb(credentials);

        await Post.findByIdAndUpdate(body.postId, {$pull: {reactions: {user: body.user}}});

        await mongoose.connection.close();
        return body;
    }
    catch (err){
        throw err;
    }
}

const getLastPostUser = async (query,credentials) => {
    try{

        await connectdb(credentials);

        let posts = await Post.find({owner: query.user}).sort(sorts['più recente']).limit(1);

        await mongoose.connection.close();
        return posts[0];
    }
    catch (err){
        throw err;
    }
}


/**
 *
 * @param {String} filter - filter for posts - ['all','image','text','geolocation']
 * @param {String} channel - channel filter for posts
 * @param credentials - mongo credentials
 * @returns {Promise<*>}
 */
const postLength = async (filter,channel,credentials) => {
    try {
        await connectdb(credentials);

        // controllo se il filtro che arriva è tra i valori dell'enum


        let posts = await Post.find(
            { ... (filter && filter !== '') && {contentType: filter},
                '$or': [{'destinationArray.name': channel}, {'officialChannelsArray': channel}],
                }).lean();


        return {length: posts.length};
    }
    catch (Error){
        throw Error;
    }
}




module.exports = {
    addPost,
    getAllPost,
    deletePost,
    updateReac,
    deleteReac,
    getLastPostUser,
    addTimedPost,
    getPostsDate,
    getReactionLast30days,
    postLength
}