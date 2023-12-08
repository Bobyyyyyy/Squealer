const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Channel = require("../schemas/Channel")
const Notification = require("../schemas/Notification")
const ReservedChannel = require("../schemas/officialChannels");
const {connectdb, createError, mongoCredentials,find_remove, CRITICAL_MASS_MULTIPLIER} = require("./utils");
const {scheduledPostArr, getNextTick} = require("../controllers/utils");
const nodeCron = require("node-cron");
const {changePopularity} = require("./userMethods");
const connection = require('../ConnectionSingle');
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

        await connection.get()

        let posts_id_reactions = await Post.find(filter,'reactions');

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

        await connection.get()

        let postsId_Date = await Post.find({owner: username},'dateOfCreation');

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

const addTimedPost = async (postId) => {
    try {
        await connection.get()

        let post = await Post.findById(postId);
        let userQuota = (await User.findOne({username: post.owner})).characters;

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
                monthly: userQuota.monthly - quota2del});

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
 * @returns {Promise<{postId: *}>}
 */
const addPost = async (post,quota) => {
    try{
        await connection.get()
        let destinations = ((typeof post.destinations) === 'string') ? JSON.parse(post.destinations) : post.destinations;
        let postCategory = 'private';
        let officialChannels = [];
        let creator = await User.findOne({username: post.creator});
        for (const destination of destinations) {
            let destinationType = destination.destType;
            let channel = await Channel.findOne({name: destination.name});

            /* ERROR HANDLING */
            /* utente non esiste  */
            if (destinationType === 'user' && !(await User.findOne({username: destination.name}))) {
                throw createError("utente non esistente!", 422);
            }
            /* canale non esiste  */
            else if (destinationType === 'channel' && channel?.length === 0) {
                throw createError("canale non esistente!", 422);
            }
            /* canale ufficiale non esiste e l'utente non mod*/
            else if (destinationType === 'official' && (!(await ReservedChannel.findOne({name: destination.name}))
                || creator.typeUser !== 'mod')) {
                throw createError("canale ufficiale non esistente o utente non moderatore!", 422);
            }
            /* tipo di destinatario non inserito */
            else if (destinationType === 'receiver') {
                throw createError("Inserisci il tipo di destinatario!", 422);
            }

            if (destinationType === 'official') {
                postCategory = 'public';
                officialChannels.push(destination.name);
                destinations.pop(destination);
            }
            else if (channel) {
                let permissionToWrite;
                if(channel.isBlocked) {
                    throw createError('Il canale è bloccato',400);
                }
                if (channel.type === 'public') {
                    permissionToWrite = await Channel.findOne({$and: [{'name': channel.name}, {$or: [{'creator': creator.username}, {'followers.user': creator.username}, {'admins': creator.username}]}]});
                    if(!permissionToWrite) {
                        throw createError(`Non hai il permesso di scrivere in ${channel.name}`, 400);
                    }
                    postCategory = 'public';
                }
                else {
                    permissionToWrite = await Channel.findOne({$and: [{'name': channel.name}, {$or: [{'creator': creator.username}, {$and: [{'followers.user': creator.username},{'follower.canWrite': true}]},{'admins': creator.username}]}]});
                    if(!permissionToWrite) {
                        throw createError(`Non hai il permesso di scrivere in ${channel.name}`, 400);
                    }
                }
                //update post number in channel schema
                channel = await Channel.findOneAndUpdate({'name': channel.name}, {'postNumber': channel.postNumber+1});
                let newNotification = channel.followers.filter((follower) => follower.user !== creator.username).map((follower) => {
                    return {user: follower.user, sender: creator.username, channel: channel.name};
                });

               await Notification.insertMany(newNotification);
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
            ...(post.tags && post.tags !== []) && {tags: post.tags},
            ... ({'reply.isReply': !!post.reply, ...(!!post.reply) && {'reply.repliedPost': post.reply.repliedPost}}),
        })

        await newPost.save();

        if (creator !== 'mod' ) {
            /* QUOTA UPDATE */
            await User.findOneAndUpdate({username: post.creator}, {
                characters:{
                    daily: quota.daily,
                    weekly: quota.weekly,
                    monthly: quota.monthly,
                }
            } );
        }



        return {postId: newPost._id};
    }
    catch(err){throw err; }
}

/**
 *
 * @param {Object} query
 * @param {String} sessionUser
 * @param {String} query.name - name of user requesting
 * @param {String} query.channel - name of channel destination
 * @param {String} query.official - name of official channel destination
 * @param {String} query.user - name of user destination
 * @param {Boolean} query.smm - is AppSmm requesting
 * @param {String} query.destType - only if destType activated
 * @param {String} query.popularity - only if popularity is activated
 * @param {String} query.typeFilter - only if type post filter activated
 * @param {Number} query.offset - offset to skip
 * @param {String} query.limit - max number of post to return
 * @param {String} query.sort - only if Sort activated -- more recent by default
 * @param {Boolean} query.reply - if you want replies of a given post
 * @param {String} query.repliedPost - father id
 * @returns {Promise<*>}
 */
const getAllPost = async (query,sessionUser) =>{
    try{
        await connection.get()
        let reply = !!query?.reply;
        let filter = {
                /* Per i canali non mi serve l'id dell'utente che fa la richiesta, a meno che non sia AppSmm*/
            ...((query.smm || !query.channel) && query.name) && {'owner':  {$regex: query.name , $options: 'i'}},
                /* FILTRO PER TIPO DI POST */
            ... (query.typeFilter && query.typeFilter !== 'all') && {'contentType': query.typeFilter},

                /* PER LA PAGINA DEL PROFILO : */
            ... (query.destType && query.destType !== 'all') && {'destinationArray.destType':  query.destType === 'user' ? 'user' : 'channel'},
            ... (query.destType && query.destType !== 'all' && query.destType !== 'user') && {'category': query.destType},
            ... (query.popularity && query.popularity !== 'neutral') && {'popularity': query.popularity},


                /* PER IL CANALE SINGOLO */
            ... (query.channel) && {'destinationArray.name': {$regex: query.channel , $options: 'i'}},

                /* PER IL CANALE UFFICIALE */
            ...(query.official) && {'officialChannelsArray': {$regex: query.official , $options: 'i'}},

            ... (query.user) && {$or: [{'destinationArray.name': {$regex: query.user , $options: 'i'}}]},

            ... {'reply.isReply': reply, ... (reply) && {'reply.repliedPost': query.reply.repliedPost}},
        }

        await connection.get();
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

        return posts;
    }
    catch (err){
        console.log(err);
        throw err;
    }
}


const removeDestination = async (destination,postID)=> {
    try {
        await connection.get()

        let checkArrayDestination = await Post.findByIdAndUpdate(postID, {$pull: { destinationArray: {name: destination}}}, {new: true});

        let checkOfficialDestination = await Post.findByIdAndUpdate(postID, {$pull: { officialChannelsArray: destination}}, {new: true});

        if(!checkArrayDestination && !checkOfficialDestination) {
            throw createError("Destinazione non nel post", 422);
        }

        if(checkArrayDestination) {
            await Channel.findOneAndUpdate({name: destination},[{$set: {'postNumber': {$subtract: ['$postNumber',1]}}}]);
        }

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
 * @returns {Promise<void>}
 * Aggiunge una destinazione a un post
 */

const addDestination = async (destination,postID) => {
    try {
        await connection.get();
        let tipo = typeof destination;
        console.log(tipo);
        let checkDestination = await Post.findOne({$and: [{'destinationArray.name': destination.name}, {_id: postID}]});
        if (checkDestination) {
            throw createError('Destinazione gia nel post',400);
        }
        switch (destination.destType) {
            case 'user':
                let user = await User.findOne({username: destination.name})
                if(!user) {
                    throw createError('Utente non esiste',400);
                }
                await Post.findByIdAndUpdate(postID,{$push: {destinationArray: destination}},{new : true});
                break;

            case 'channel':
                let channel = await Channel.findOne({name: destination.name});
                if(!channel) {
                    throw createError('Canale Non esiste',400);
                }
                if(channel.isBlocked) {
                    throw createError('Canale bloccato',400);
                }
                await Channel.findByIdAndUpdate(channel._id,[{$set: {'postNumber': {$add: ['$postNumber',1]}}}]).lean();
                await Post.findByIdAndUpdate(postID,{$push: {destinationArray: destination}},{new : true}).lean();
                await Post.updateMany({'reply.repliedPost': postID}, {$push: {destinationArray: destination}}).lean();
                break;

            case 'official':
                let officialChannel = await ReservedChannel.findOne({name: destination.name});
                if(!officialChannel) {
                    throw createError('Canale Non esiste',400);
                }
                await Post.findByIdAndUpdate(postID,{$push: {officialChannelsArray: destination.name}},{new : true});
                break;
        }
    }
    catch (error) {
        throw error
    }
}

const deletePost = async (postID) => {
    try{
        await connection.get()
        return await Post.findByIdAndRemove(postID).lean();
    }
    catch(err){
        throw err;
    }
}




const updateReac = async (body) => {
    try{
        await connection.get()
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

        return body;
    }
    catch (err){
        throw err;
    }
}

const deleteReac = async (body) => {
    try{
        await connection.get()

        await Post.findByIdAndUpdate(body.postId, {$pull: {reactions: {user: body.user}}});

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
            await addDestination({name: 'CONTROVERSIAL', destType: 'official'},post._id);
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
            await addDestination({name: 'CONTROVERSIAL', destType: 'official'},post._id);
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

const getLastPostUser = async (query) => {
    try{
        await connection.get()

        let posts = await Post.find({owner: query.user}).sort(sorts['più recente']).limit(1);

        return posts[0];
    }
    catch (err){
        throw err;
    }
}


/**
 *
 * @param filters
 * @returns {Promise<*>}
 */
const postLength = async (filters) => {
    try {
        await connection.get()
        let reply = !!filters?.reply;

        let filter = {
            /* Per i canali non mi serve l'id dell'utente che fa la richiesta, a meno che non sia AppSmm*/
            ...((filters.smm || !filters.channel) && filters.name) && {'owner':  {$regex: filters.name , $options: 'i'}},
            /* FILTRO PER TIPO DI POST */
            ... (filters.typeFilter && filters.typeFilter !== 'all') && {'contentType': filters.typeFilter},

            /* PER LA PAGINA DEL PROFILO : */
            ... (filters.destType && filters.destType !== 'all') && {'destinationArray.destType':  filters.destType === 'user' ? 'user' : 'channel'},
            ... (filters.destType && filters.destType !== 'all' && filters.destType !== 'user') && {'category': filters.destType},
            ... (filters.popularity && filters.popularity !== 'neutral') && {'popularity': filters.popularity},

            /* PER IL CANALE SINGOLO */
            ... (filters.channel) && {'destinationArray.name': {$regex: filters.channel , $options: 'i'}},

            /* PER IL CANALE UFFICIALE */
            ...(filters.official) && {'officialChannelsArray': {$regex: filters.official , $options: 'i'}},

            ... (filters.user) && {$or: [{'destinationArray.name': {$regex: filters.user , $options: 'i'}}]},

            ... {'reply.isReply': reply, ... (reply) && {'reply.repliedPost': filters.reply.repliedPost}},
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