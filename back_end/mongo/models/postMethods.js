const mongoose = require('mongoose');
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Channel = require("../schemas/Channel")
const ReservedChannel = require("../schemas/officialChannels");
const {connectdb, createError, mongoCredentials,find_remove, CRITICAL_MASS_MULTIPLIER} = require("./utils");
const {scheduledPostArr, getNextTick} = require("../controllers/utils");
const nodeCron = require("node-cron");
const {changePopularity} = require("./userMethods");

/**
 *
 * @param {String} username
 * @param {Object} channel  -   channel Name. Used for stats
 * @returns {Promise<[{reaction}]>}
 */
const getReactionLast30days = async(username, channel = undefined) => {
    try{

        let filter = {
            owner: username,
            ...(!!channel) && {'destinationArray.name': { $in: [channel] }},
        }

        await connectdb(mongoCredentials);

        let posts_id_reactions = await Post.find(filter,'reactions');

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
 * {creator: String, destination: array of objects{name: String, destType: String}, contentType: String, content: String, dateOfCreation: Date , tags: Array<String>}
 * @param {Object} quota - {daily,weekly-monthly} - remaining updated
 * @param credentials - mongo credentials
 * @returns {Promise<{postId: *}>}
 */
const addPost = async (post,quota,credentials) => {
    try{
        await connectdb(credentials)
        let destinations = ((typeof post.destinations) === 'string') ? JSON.parse(post.destinations) : post.destinations;
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
            else if (destinationType === 'channel' && channel?.length === 0) {
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
            else if (channel) {
                if(channel.isBlocked) {
                    throw createError('Il canale è bloccato',400);
                }
                if (channel.type === 'public') {
                    postCategory = 'public';
                }
                //update post number in channel schema
                await Channel.findOneAndUpdate({'name': channel.name}, {'postNumber': channel.postNumber+1})
            }
        }

        /* POST SAVE */
        let newPost = new Post({
            owner: post.creator,
            destinationArray: destinations,
            contentType: post.contentType,
            content: (post.timed && post.contentType === 'text') ? parseText(post.content, 1) : post.content,
            reactions: [],
            views: [],
            officialChannelsArray: officialChannels,
            category: postCategory,
            popularity: 'neutral',
            dateOfCreation: post.dateOfCreation,
            tags: post.tags
        })

        await newPost.save();

        if (creatorType !== 'mod' ) {
            /* QUOTA UPDATE */
            await User.findOneAndUpdate({username: post.creator}, {
                characters:{
                    daily: quota.daily,
                    weekly: quota.weekly,
                    monthly: quota.monthly,
                }
            } );
        }

        await mongoose.connection.close();

        return {postId: newPost._id};
    }
    catch(err){throw err; }
}

/**
 *
 * @param {Object} query
 * @param {String} sessionUser
 * @param {String} query.name - name of user requesting
 * @param {String} query.channel - name of channel
 * @param {Boolean} query.smm - is SMM requesting
 * @param {String} query.destType - only if destType activated
 * @param {String} query.popularity - only if popularity is activated
 * @param {String} query.typeFilter - only if type post filter activated
 * @param {Number} query.offset - offset to skip
 * @param {String} query.limit - max number of post to return
 * @param {String} query.sort - only if Sort activated -- more recent by default
 * @param credentials
 * @returns {Promise<*>}
 */
const getAllPost = async (query,sessionUser,credentials) =>{
    try{
        await connectdb(credentials);
        let filter = {
                /* Per i canali non mi serve l'id dell'utente che fa la richiesta, a meno che non sia SMM*/
            ...((query.smm || !query.channel) && query.name) && {'owner':  {$regex: query.name , $options: 'i'}},
                /* FILTRO PER TIPO DI POST */
            ... (query.typeFilter && query.typeFilter !== 'all') && {'contentType': query.typeFilter},

                /* PER LA PAGINA DEL PROFILO : */
            ... (query.destType && query.destType !== 'all') && {'destinationArray.destType':  query.destType === 'user' ? 'user' : 'channel'},
            ... (query.destType && query.destType !== 'all' && query.destType !== 'user') && {'category': query.destType},
            ... (query.popularity && query.popularity !== 'neutral') && {'popularity': query.popularity},


                /* PER IL CANALE SINGOLO */
            ... (query.channel) && {$or: [{'destinationArray.name': {$regex: query.channel , $options: 'i'}},
                 {'officialChannelsArray': {$regex: query.channel , $options: 'i'}}]
            }
        }



        let posts = await Post.find(filter)
            .skip(parseInt(query.offset))
            .limit(parseInt(query.limit))
            .sort(sorts[query.sort ?  query.sort : 'più recente'])
            .lean();

        // Update delle views e della categoria se necessario
        let user = await User.findOne({username: sessionUser});

        if(user.typeUser !== 'mod') {
            for (const post of posts) {
                let filteredArray = post.views.filter(user => {return user.name === sessionUser})
                if(filteredArray.length === 0) {
                    let NumberofViews = ++post.views.length;
                    let CriticalMass = post.criticalMass + (NumberofViews * CRITICAL_MASS_MULTIPLIER)
                    let view = {
                        name: sessionUser,
                        date: new Date(),
                    }
                    let postToUpdate = await Post.findByIdAndUpdate(post._id,{$push: {'views': view} , 'criticalMass': parseInt(CriticalMass)});
                    await UpdateCategory(postToUpdate,user._id);
                }
            }
        }


        await mongoose.connection.close()
        return posts;
    }
    catch (err){
        console.log(err);
        throw err;
    }
}


const removeDestination = async (destination,postID,credentials)=> {
    try {
        await connectdb(credentials);



        let checkArrayDestination = await Post.findByIdAndUpdate(postID, {$pull: { destinationArray: {name: destination}}}, {new: true});

        let checkOfficialDestination = await Post.findByIdAndUpdate(postID, {$pull: { officialChannelsArray: destination}}, {new: true});

        if(!checkArrayDestination && !checkOfficialDestination) {
            throw createError("Destinazione non nel post", 422);
        }

        await Channel.findOneAndUpdate({'name': channel.name}, {'postNumber': channel.postNumber-1})

        if(checkArrayDestination.destinationArray.length === 0 && checkOfficialDestination.officialChannelsArray.length === 0) {
            await deletePost(postID);
        }
    }
    catch (error) {
        throw err;
    }
}

/**
 * @param destination
 * @param postID
 * @param credentials
 * @returns {Promise<void>}
 * Aggiunge una destinazione a un post
 */

const addDestination = async (destination,postID,credentials) => {
    try {
        await connectdb(credentials);
        console.log(destination,postID);
        switch (destination.destType) {
            case 'user':
                let user = await User.findOne({username: destination.name})
                if(!user) {
                    throw createError('Utente non esiste',400);
                }
                break;

            case 'channel':
                let channel = await Channel.findOne({name: destination.name});
                if(!channel) {
                    throw createError('Canale Non esiste',400);
                }
                await Channel.findOneAndUpdate({'name': destination.name}, {'postNumber': channel.postNumber+1})
                break;

            case 'official':
                let officialChannel = await ReservedChannel.findOne({name: destination.name});
                if(!officialChannel) {
                    throw createError('Canale Non esiste',400);
                }

                break;
        }

        await Post.findByIdAndUpdate(postID,{$push: {destinationArray: destination}},{new : true});

    }
    catch (error) {
        throw error
    }
}

const deletePost = async (postID,credentials) => {
    try{
        await connectdb(credentials)
        let postToDelete = await Post.findByIdAndRemove(postID).lean();
        await mongoose.connection.close();
        return postToDelete;
    }
    catch(err){
        throw err;
    }
}




const updateReac = async (body,credentials) => {
    try{
        await connectdb(credentials);
        let user = await User.findOne({username: body.user});

        if(user.typeUser === 'mod') {
            let post = await Post.findByIdAndUpdate(body.postId, {$push:{reactions: {$each: JSON.parse(body.reactions)}}},{new: true});
            await UpdateCategory(post,user._id);
            return body;
        }

        let hasReacted = (await Post.findOne({_id : body.postId, reactions:{$elemMatch:{user: body.user}}}));

        if (hasReacted){
            await Post.findByIdAndUpdate(body.postId, {$pull: {reactions: {user: body.user}}});
        }

        let post = await Post.findByIdAndUpdate(body.postId, {$push:{reactions: {rtype: body.reaction, user: body.user, date: new Date()}}});
        await UpdateCategory(post,user._id);

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
};


/**
 * @param {Object} post
 * @param {String} userID
 * @returns {Promise<boolean>}
 */
const UpdateCategory = async (post, userID) => {
    let criticalMass = post.criticalMass;
    let positiveReactionsCount = 0;
    let negativeReactionsCount = 0;

     post.reactions.forEach((reaction) => {
         if (reaction.rtype === 'thumbs-up') {
             positiveReactionsCount ++;
         }
         else if (reaction.rtype === 'heart') {
             positiveReactionsCount += 2;
         }
         else if (reaction.rtype === 'thumbs-down') {
             negativeReactionsCount ++;
         }
         else if (reaction.rtype === 'heartbreak') {
             negativeReactionsCount += 2;
         }
     })

    if (positiveReactionsCount > criticalMass) {
        if (negativeReactionsCount > criticalMass) {
            await Post.findByIdAndUpdate(post._id, {popularity: 'controversial'});
            if (post.popularity === 'popular') {
                await changePopularity(userID, 'popularity',false);
            }
            else if (post.popularity === 'unpopular'){
                await changePopularity(userID, 'unpopularity',false);
            }
        }
        else {
            await Post.findByIdAndUpdate(post._id, {popularity: 'popular'});
            await changePopularity(userID, 'popularity',true);
        }
        return true;
    }

    if (negativeReactionsCount > criticalMass) {
        if (positiveReactionsCount > criticalMass) {
            await Post.findByIdAndUpdate(post._id, {popularity: 'controversial'});
            if (post.popularity === 'popular') {
                await changePopularity(userID, 'popularity',false);
            }
            else if (post.popularity === 'unpopular'){
                await changePopularity(userID, 'unpopularity',false);
            }
        }
        else {
            await Post.findByIdAndUpdate(post._id, {popularity: 'unpopular'});
            await changePopularity(userID,'unpopularity',true);

        }
        return true;
    }

    if (post.category !== 'neutral') {
        await Post.findByIdAndUpdate(post._id, {popularity: 'neutral'});
        if (post.popularity === 'popular') {
            await changePopularity(userID, 'popularity' ,false);
        }
        else if (post.popularity === 'unpopular'){
            await changePopularity(userID, 'unpopularity',true);
        }
        return true;
    }



    return false;
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
 * @param filters
 * @param credentials - mongo credentials
 * @returns {Promise<*>}
 */
const postLength = async (filters,credentials) => {
    try {
        await connectdb(credentials);
        let filter = {
            /* Per i canali non mi serve l'id dell'utente che fa la richiesta, a meno che non sia SMM*/
            ...((filters.smm || !filters.channel) && filters.name) && {'owner':  {$regex: filters.name , $options: 'i'}},
            /* FILTRO PER TIPO DI POST */
            ... (filters.typeFilter && filters.typeFilter !== 'all') && {'contentType': filters.typeFilter},

            /* PER LA PAGINA DEL PROFILO : */
            ... (filters.destType && filters.destType !== 'all') && {'destinationArray.destType':  filters.destType === 'user' ? 'user' : 'channel'},
            ... (filters.destType && filters.destType !== 'all' && filters.destType !== 'user') && {'category': filters.destType},
            ... (filters.popularity && filters.popularity !== 'neutral') && {'popularity': filters.popularity},


            /* PER IL CANALE SINGOLO */
            ... (filters.channel) && {$or: [{'destinationArray.name': {$regex: filters.channel , $options: 'i'}},
                    {'officialChannelsArray': {$regex: filters.channel , $options: 'i'}}]
            }
        }

        let posts = await Post.find(filter).lean();


        return {length: posts.length};
    }
    catch (Error){
        throw Error;
    }
}




module.exports = {
    addPost,
    getAllPost,
    removeDestination,
    deletePost,
    updateReac,
    deleteReac,
    getLastPostUser,
    addTimedPost,
    getPostsDate,
    getReactionLast30days,
    postLength,
    addDestination
}