const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Reply = require("../schemas/Reply");
const Channel = require("../schemas/Channel");
const Notification = require("../schemas/Notification")
const OfficialChannel = require("../schemas/officialChannels");
const {connectdb, createError, mongoCredentials,find_remove, CRITICAL_MASS_MULTIPLIER, sorts} = require("./utils");
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
	console.log("ENTRO TEMPORIZZATO");
        let post = await Post.findById(postId).lean();
        let userQuota = (await User.findOne({username: post.owner})).characters;

        if (userQuota.daily === 0 || userQuota.weekly === 0 || userQuota.monthly === 0){
            throw createError('quota 0', 404);
        }

        let timedInfo = scheduledPostArr.find(el => el['id']===postId);

            /* same structure of body passed in addPost */
        let newPost = {
            creator: post.owner,
            destinations: post.destinationArray,
            officialChannelsArray: post.officialChannelsArray,
            contentType: post.contentType,
            dateOfCreation: Date.now(),
            content: post.contentType === 'text' ? parseText(timedInfo.content,timedInfo.done + 1) : post.content
        }
        let delQuota = !!newPost.destinations.find(dest => dest.destType !== 'user');

        let quota2del = delQuota ? (post.contentType === 'text' ? newPost.content.length : 125) : 0;

        if (userQuota.daily - quota2del < -50 || userQuota.weekly - quota2del < -50 || userQuota.monthly - quota2del < -50){
            throw createError('50 caratteri extra ecceduti', 404);
        }

        let id = await addPost(newPost, {
                daily: userQuota.daily - quota2del,
                weekly: userQuota.weekly - quota2del,
                monthly: userQuota.monthly - quota2del});

        //check se id restituisce errore;

        updateScheduledPost(postId);

        return {newPostId : id};

    }catch (err) {
        throw err;
    }
}

/**
 * @param {Object} post
 * {creator: String, destinations: array of objects{name: String, destType: String}, contentType: String, content: String, dateOfCreation: Date ,}
 * @param {Object} quota - {daily,weekly-monthly} - remaining updated
 * @returns {Promise<{postId: *}>}
 */
const addPost = async (post,quota) => {
    try{
        await connection.get()
        let destinations = ((typeof post.destinations) === 'string') ? JSON.parse(post.destinations) : post.destinations;
        if(typeof destinations === "undefined") {
            throw createError('Non si è inserito nessun destinatario',400);
        }
        let postCategory = 'private';
        let officialChannels = post?.officialChannelsArray ? post.officialChannelsArray : [];
        let creator = await User.findOne({username: post.creator});
        for (const destination of destinations) {

            if(!isNaN(parseInt(destination.name))) {
                throw createError('Nome non valido',400);
            }

            if ( !['user', 'channel', 'official','keyword'].includes(destination.destType)){
                throw createError(`destinazione non valida. Inserire una destinazione sintatticamente valida.`, 400);
            }
            let destinationType = destination.destType;
            let channel = await Channel.findOne({name: destination.name});

            /* ERROR HANDLING */
            /* utente non esiste  */
            if (destinationType === 'user' && !(await User.findOne({username: destination.name}))) {
                throw createError("utente non esistente!", 400);
            }
            /* canale non esiste  */
            else if (destinationType === 'channel' && !channel) {
                throw createError("canale non esistente!", 400);
            }
            /* canale ufficiale non esiste e l'utente non mod*/
            else if (destinationType === 'official' && (!(await OfficialChannel.findOne({name: destination.name})) || (creator.typeUser !== 'mod'))) {
                throw createError("canale ufficiale non esistente o utente non moderatore!", 400);
            }
            /* tipo di destinatario non inserito */
            else if (destinationType === 'receiver') {
                throw createError("Inserisci il tipo di destinatario!", 400);
            }

            if (destinationType === 'official') {
                postCategory = 'public';
                officialChannels.push(destination.name);
                destinations.pop(destination);
            }
	    else if (destinationType === 'keyword') {
		postCategory = 'public';
	    }
            else if (destinationType === 'channel') {
                let permissionToWrite;
                if(channel.isBlocked) {
                    throw createError('Il canale è bloccato',400);
                }
                if (channel.type === 'public') {
                    if(creator.typeUser !== 'mod') {
                        permissionToWrite = await Channel.findOne({$and: [{'name': channel.name}, {$or: [{'creator': creator.username}, {$and: [{'followers.user': creator.username}, {'followers.canWrite': true}]}, {'admins': creator.username}]}]});
                        if (!permissionToWrite) {
                            throw createError(`Non hai il permesso di scrivere in ${channel.name}`, 400);
                        }
                    }
                    postCategory = 'public';
                }
                else {
                    if(creator.typeUser !== 'mod') {
                        permissionToWrite = await Channel.findOne({$and: [{'name': channel.name}, {$or: [{'creator': creator.username}, {$and: [{'followers.user': creator.username}, {'followers.canWrite': true}]}, {'admins': creator.username}]}]});
                        if (!permissionToWrite) {
                            throw createError(`Non hai il permesso di scrivere in ${channel.name}`, 400);
                        }
                    }
                }
                //update post number in channel schema
                channel = await Channel.findOneAndUpdate({'name': channel.name}, {'postNumber': channel.postNumber+1});
                let newFollowerNotification = channel.followers.filter((follower) => follower.user !== creator.username).map((follower) => {
                    return {user: follower.user, sender: creator.username, channel: channel._id};
                });

                let newAdminNotification = channel.admins.filter((admin) => admin !== creator.username).map((admin) => {
                    return {user: admin, sender: creator.username, channel: channel._id};
                });

                let creatorNotification = (creator.username !== channel.creator) ?
                    [{user: channel.creator, sender: creator.username, channel: channel._id}] : [];
                let allNotification = [...newFollowerNotification, ...newAdminNotification, ...creatorNotification];

                await Notification.insertMany(allNotification);

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
        })



        if (creator.typeUser !== 'mod') {
            /* QUOTA UPDATE */
            if(quota.daily < 0) {
                quota.weekly += quota.daily;
                quota.daily = 0;

            }

            if(quota.weekly < 0) {
                quota.monthly += quota.weekly;
                quota.weekly = 0;
            }

            if(quota.monthly < 0) {
                throw createError('No more quota remaining',400);
            }


            await User.findOneAndUpdate({username: post.creator}, {
                characters:{
                    daily: quota.daily,
                    weekly: quota.weekly,
                    monthly: quota.monthly,
                }
            } );
        }

        await newPost.save();
        return {post: newPost.toObject()};
    }
    catch(err){
        console.log("ERRORE:",  err)
        throw err;
    }
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
 * @param {String} query.repliedPost - father id
 * @param {String} query.keyword - keyword search
 * @returns {Promise<*>}
 */
const getAllPost = async (query,sessionUser) =>{
    try{
        let filter = {
                /* Per i canali non mi serve l'id dell'utente che fa la richiesta, a meno che non sia AppSmm*/
            ...((query.smm || !query.channel) && query.name) && {'owner': query.name},
                /* FILTRO PER TIPO DI POST */
            ... (query.typeFilter && query.typeFilter !== 'all') && {'contentType': query.typeFilter},

                /* PER LA PAGINA DEL PROFILO : */
            ... (query.destType && query.destType !== 'all') && {'destinationArray.destType':  query.destType === 'user' ? 'user' : 'channel'},
            ... (query.destType && query.destType !== 'all' && query.destType !== 'user') && {'category': query.destType},
            ... (query.popularity && query.popularity !== 'neutral') && {'popularity': query.popularity},


                /* PER IL CANALE SINGOLO */
            ... (query.channel) && {$and: [{'destinationArray.name': query.channel}, {"destinationArray.destType": 'channel'}]},

                /* PER IL CANALE UFFICIALE */
            ...(query.official) && {'officialChannelsArray': query.official},

            ... (query.user) && {$and: [{'destinationArray.name': query.user}, {"destinationArray.destType": 'user'}]},

            ...(query.keyword) && {$and: [{'destinationArray.name': query.keyword}, {'destinationArray.destType': 'keyword'}]},

            ...(query.mention) && {$and: [{'content' : {$regex: query.mention}},{'contentType': 'text'}]},
        }

        await connection.get();

        let posts = await Post.aggregate([
            {
                $project: {
                    owner: '$owner',
                    destinationArray: '$destinationArray',
                    officialChannelsArray: '$officialChannelsArray',
                    category: '$category',
                    popularity: '$popularity',
                    contentType: '$contentType',
                    content: '$content',
                    reactions: '$reactions',
                    dateOfCreation: '$dateOfCreation',
                    criticalMass: '$criticalMass',
                    views: '$views',
                    views_count: {$size: '$views'},
                }
            },
            {$match: filter},
            {$sort: query.sort ? sorts[query.sort] : sorts['più recente']},
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "username",
                    as: "user_info",
                },
            },
            {
              $unwind: "$user_info",
            },
            {
                $project:{
                    owner: '$owner',
                    destinationArray: '$destinationArray',
                    officialChannelsArray: '$officialChannelsArray',
                    category: '$category',
                    popularity: '$popularity',
                    contentType: '$contentType',
                    content: '$content',
                    reactions: '$reactions',
                    dateOfCreation: '$dateOfCreation',
                    criticalMass: '$criticalMass',
                    views: '$views',
                    views_count: {$size: '$views'},
                    profilePicture: '$user_info.profilePicture',
                }
            },
            {$skip: parseInt(query.offset)},
            {$limit: parseInt(query.limit)},
        ])


        // Update delle views e della categoria se necessario
        if(sessionUser.typeUser !== 'mod') {
            for (const post of posts) {
                let filteredArray = post.views.filter(user => {return user.name === sessionUser.username})
                if(filteredArray.length === 0) {
                    let NumberofViews = ++post.views.length;
                    let CriticalMass = NumberofViews * CRITICAL_MASS_MULTIPLIER
                    let view = {
                        name: sessionUser.username,
                        date: new Date(),
                    }
                    let postToUpdate = await Post.findByIdAndUpdate(post._id,{$push: {'views': view} , 'criticalMass': parseInt(CriticalMass)});

                    let creator = await User.findOne({username: post.owner}).lean();
                    await UpdateCategory(postToUpdate,creator._id);
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

/**
 *
 * @param {String} userInSession
 * @param {Number} limit
 * @param {Number} offset
 * @return {Promise<void>}
 */
const getPostHome = async (userInSession , limit, offset) => {
    try{
        await connection.get();

        let posts = await Post.aggregate([
            {
                $lookup: {
                    from: "channels",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { 'creator': userInSession },
                                    { 'admins': userInSession },
                                    {'followers.user': userInSession},
                                ],
                            },
                        },
                        {
                            $project: {
                                name: "$name",
                            },
                        },
                    ],
                    as: "channel_info",
                },
            },
            {
                $lookup: {
                    from: "officialchannels",
                    pipeline: [
                        {
                            $match: {
                                silenced: userInSession,
                            },
                        },
                        {
                            $project: {
                                name: "$name",
                            },
                        },
                    ],
                    as: "silenced_official",
                },
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            {
                                $and: [
                                    {
                                        $in: [
                                            "channel",
                                            "$destinationArray.destType",
                                        ],
                                    },
                                    {
                                        $reduce:{
                                            input:'$channel_info',
                                            initialValue: false,
                                            in: {
                                                $or:[
                                                    '$$value',
                                                    {
                                                        $in:["$$this.name", '$destinationArray.name']
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                ],
                            },
                            {
                                $in:["keyword", "$destinationArray.destType"]
                            },
                            {
                                $and:[
                                    {
                                        $gt:[{$size:"$officialChannelsArray"}, 0],
                                    },
                                    {
                                        $not:{
                                            $eq:[
                                                {
                                                    $size:{
                                                        $filter: {
                                                            input: '$silenced_official',
                                                            as: 'off_sil',
                                                            cond:{
                                                                $in:['$$off_sil.name', '$officialChannelsArray']
                                                            }
                                                        }
                                                    },
                                                },
                                                {
                                                    $size: '$officialChannelsArray',
                                                }
                                            ]
                                        }
                                    }
                                ],
                            }
                        ]
                    }
                }
            },
            {$sort: sorts['più recente']},
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "username",
                    as: "user_info",
                },
            },
            {
                $unwind: "$user_info",
            },
            {
                $project:{
                    owner: '$owner',
                    destinationArray: '$destinationArray',
                    officialChannelsArray: '$officialChannelsArray',
                    category: '$category',
                    contentType: '$contentType',
                    content: '$content',
                    reactions: '$reactions',
                    dateOfCreation: '$dateOfCreation',
		    views: '$views',
		    criticalMass: '$criticalMass',
                    views_count: {$size: '$views'},
                    profilePicture: '$user_info.profilePicture',
                }
            },
            {$skip: parseInt(offset)},
            {$limit: parseInt(limit)},
        ]);

	  // Update delle views e della categoria se necessario
            for (const post of posts) {
                let filteredArray = post.views.filter(user => {return user.name === userInSession})
                if(filteredArray.length === 0) {
                    let NumberofViews = ++post.views.length;
                    let CriticalMass = NumberofViews * CRITICAL_MASS_MULTIPLIER
                    let view = {
                        name: userInSession,
                        date: new Date(),
                    }
                    let postToUpdate = await Post.findByIdAndUpdate(post._id,{$push: {'views': view} , 'criticalMass': parseInt(CriticalMass)});

                    let creator = await User.findOne({username: post.owner}).lean();
                    await UpdateCategory(postToUpdate,creator._id);
                }
            }



        return posts;

    }catch (err){
        throw err;
    }
}


const getPostFromMention = async (userInSession, mention, limit, offset) => {
    try{
        await connection.get();

        let posts = await Post.aggregate([
            {
                $lookup: {
                    from: "channels",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { 'creator': userInSession },
                                    { 'admins': userInSession },
                                    {'followers.user': userInSession}
                                ],
                            },
                        },
                        {
                            $project: {
                                name: "$name",
                            },
                        },
                    ],
                    as: "channel_info",
                },
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    { $in: ["channel", "$destinationArray.destType"] },
                                                    {
                                                        $reduce: {
                                                            input: '$channel_info',
                                                            initialValue: false,
                                                            in: {
                                                                $or: [
                                                                    '$$value',
                                                                    { $in: ["$$this.name", '$destinationArray.name'] },
                                                                ],
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                            { $eq: ["$owner", userInSession] },
                                            { $in: [userInSession, "$destinationArray.name"]}
                                        ],
                                    },
                                    { $in: ["keyword", "$destinationArray.destType"] },
                                    { $gt: [{ $size: "$officialChannelsArray" }, 0] },
                                ],
                            },
                            {
                                $regexMatch: {
                                    input: "$content",
                                    regex: mention,
                                    options: "i", // Case-insensitive
                                },
                            },
                            {
                                $eq: ["$contentType", "text"],
                            },
                        ],
                    },
                },
            },
            {$sort: sorts['più recente']},
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "username",
                    as: "user_info",
                },
            },
            {
                $unwind: "$user_info",
            },
            {
                $project:{
                    owner: '$owner',
                    destinationArray: '$destinationArray',
                    officialChannelsArray: '$officialChannelsArray',
                    category: '$category',
                    contentType: '$contentType',
                    content: '$content',
                    reactions: '$reactions',
                    dateOfCreation: '$dateOfCreation',
 		    views: '$views',
		    criticalMass: '$criticalMass',
                    views_count: {$size: '$views'},
                    profilePicture: '$user_info.profilePicture',
                }
            },
            {$skip: parseInt(offset)},
            {$limit: parseInt(limit)},
        ]);


	 // Update delle views e della categoria se necessario
            for (const post of posts) {
                let filteredArray = post.views.filter(user => {return user.name === userInSession})
                if(filteredArray.length === 0) {
                    let NumberofViews = ++post.views.length;
                    let CriticalMass = NumberofViews * CRITICAL_MASS_MULTIPLIER
                    let view = {
                        name: userInSession,
                        date: new Date(),
                    }
                    let postToUpdate = await Post.findByIdAndUpdate(post._id,{$push: {'views': view} , 'criticalMass': parseInt(CriticalMass)});

                    let creator = await User.findOne({username: post.owner}).lean();
                    await UpdateCategory(postToUpdate,creator._id);
                }
            }


        return posts;

    }catch (err) {
        throw err;
    }
}


const getPostHomeAnonymous = async (userInSession,limit, offset) => {
    try{
        await connection.get();

        let posts = await Post.aggregate([
            {
                $lookup: {
                    from: "channels",
                    pipeline: [
                        {
                            $project: {
                                name: "$name",
                            },
                        },
                    ],
                    as: "channel_info",
                },
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            {
                                $in: [
                                    "channel",
                                    "$officialChannelsArray.destType",
                                ],
                            },
                            {
                                $reduce: {
                                    input: "$channel_info",
                                    initialValue: false,
                                    in: {
                                        $and: [
                                            "$$value",
                                            {
                                                $in: [
                                                    "$$this.name",
                                                    "$officialChannelsArray.name",
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $and: [
                                    {
                                        $gt: [
                                            { $size: "$officialChannelsArray" },
                                            0,
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                }
            },
            {$sort: sorts['più recente']},
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "username",
                    as: "user_info",
                },
            },
            {
                $unwind: "$user_info",
            },
            {
                $project:{
                    owner: '$owner',
                    destinationArray: '$destinationArray',
                    officialChannelsArray: '$officialChannelsArray',
                    category: '$category',
                    contentType: '$contentType',
                    content: '$content',
                    reactions: '$reactions',
                    dateOfCreation: '$dateOfCreation',
		    views: '$views',
		    criticalMass: '$criticalMass',
                    views_count: {$size: '$views'},
                    profilePicture: '$user_info.profilePicture',
                }
            },
            {$skip: parseInt(offset)},
            {$limit: parseInt(limit)},
        ]);

	 // Update delle views e della categoria se necessario
            for (const post of posts) {
                let filteredArray = post.views.filter(user => {return user.name === userInSession})
                if(filteredArray.length === 0) {
                    let NumberofViews = ++post.views.length;
                    let CriticalMass = NumberofViews * CRITICAL_MASS_MULTIPLIER
                    let view = {
                        name: userInSession,
                        date: new Date(),
                    }
                    let postToUpdate = await Post.findByIdAndUpdate(post._id,{$push: {'views': view} , 'criticalMass': parseInt(CriticalMass)});

                    let creator = await User.findOne({username: post.owner}).lean();
                    await UpdateCategory(postToUpdate,creator._id);
                }
            }


        return posts;

    }catch (err){
        throw err;
    }
}


const getPostByUsername2watch = async (userInSession , limit, offset, user2watch) => {
    try{
        let checkUser2watch = await User.findOne({username: user2watch});

        if (!checkUser2watch) {
            throw createError("Utente non esiste", 400);
        }

        let filterChannel = {$and: [
                {
                    $or: [
                        { 'creator': userInSession },
                        { 'admins': userInSession },
                        {'followers.user': userInSession},
                    ],
                },
                {
                    $or: [
                        { 'creator': user2watch },
                        { 'admins': user2watch },
                        {'followers.user': user2watch},
                    ],
                }
            ]}

        await connection.get();

        let posts = await Post.aggregate([
            {
                $lookup: {
                    from: "channels",
                    pipeline: [
                        {
                            $match: filterChannel,
                        },
                        {
                            $project: {
                                name: "$name",
                            },
                        },
                    ],
                    as: "channel_info",
                },
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    user2watch, '$owner'
                                ]
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            {
                                                $in: [
                                                    "channel",
                                                    "$destinationArray.destType",
                                                ],
                                            },
                                            {
                                                $reduce:{
                                                    input:'$channel_info',
                                                    initialValue: false,
                                                    in: {
                                                        $or:[
                                                            '$$value',
                                                            {
                                                                $in:["$$this.name", '$destinationArray.name']
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                        ],
                                    },
                                    {
                                        $in:["keyword", "$destinationArray.destType"]
                                    },
                                ]
                            },
                        ],
                    }
                }
            },
            {$sort: sorts['più recente']},
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "username",
                    as: "user_info",
                },
            },
            {
                $unwind: "$user_info",
            },
            {
                $project:{
                    owner: '$owner',
                    destinationArray: '$destinationArray',
                    officialChannelsArray: '$officialChannelsArray',
                    category: '$category',
                    contentType: '$contentType',
                    content: '$content',
		    views: '$views',
                    reactions: '$reactions',
		    criticalMass: '$criticalMass',
                    dateOfCreation: '$dateOfCreation',
                    views_count: {$size: '$views'},
                    profilePicture: '$user_info.profilePicture',
                }
            },
            {$skip: parseInt(offset)},
            {$limit: parseInt(limit)},
        ])


	   // Update delle views e della categoria se necessario
            for (const post of posts) {
                let filteredArray = post.views.filter(user => {return user.name === userInSession})
                if(filteredArray.length === 0) {
                    let NumberofViews = ++post.views.length;
                    let CriticalMass = NumberofViews * CRITICAL_MASS_MULTIPLIER
                    let view = {
                        name: userInSession,
                        date: new Date(),
                    }
                    let postToUpdate = await Post.findByIdAndUpdate(post._id,{$push: {'views': view} , 'criticalMass': parseInt(CriticalMass)});

                    let creator = await User.findOne({username: post.owner}).lean();
                    await UpdateCategory(postToUpdate,creator._id);
                }
            }


        return posts;

    }catch (err){
        throw err;
    }
}


const getPostByProfile = async (username, limit, offset) => {
    try {
        await connection.get();

        let posts = await Post.aggregate([
            {
                $match: {
                    $expr: {
                        $or: [
                            {
                                $eq: [
                                    "$owner",
                                    username
                                ]
                            },
                            {
                                $in: [
                                    username,
                                    "$destinationArray.name"
                                ]
                            }
                        ]
                    }
                }
            },
            {$sort: sorts['più recente']},
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "username",
                    as: "user_info",
                },
            },
            {
                $unwind: "$user_info",
            },
            {
                $project:{
                    owner: '$owner',
                    destinationArray: '$destinationArray',
                    officialChannelsArray: '$officialChannelsArray',
                    category: '$category',
                    contentType: '$contentType',
                    content: '$content',
		    views: '$views',
		    criticalMass: '$criticalMass',
                    reactions: '$reactions',
                    dateOfCreation: '$dateOfCreation',
                    views_count: {$size: '$views'},
                    profilePicture: '$user_info.profilePicture',
                }
            },
            {$skip: parseInt(offset)},
            {$limit: parseInt(limit)},
        ])

	// Update delle views e della categoria se necessario
            for (const post of posts) {
                let filteredArray = post.views.filter(user => {return user.name === username})
                if(filteredArray.length === 0) {
                    let NumberofViews = ++post.views.length;
                    let CriticalMass = NumberofViews * CRITICAL_MASS_MULTIPLIER
                    let view = {
                        name: username,
                        date: new Date(),
                    }
                    let postToUpdate = await Post.findByIdAndUpdate(post._id,{$push: {'views': view} , 'criticalMass': parseInt(CriticalMass)});

                    let creator = await User.findOne({username: post.owner}).lean();
                    await UpdateCategory(postToUpdate,creator._id);
                }
            }

        return posts;

    } catch (err) {
        throw err;
    }
}


const removeDestination = async (destination,postID)=> {
    try {
        await connection.get()

        let checkArrayDestination = await Post.findByIdAndUpdate(postID, {$pull: { destinationArray: {name: destination}}}, {new: true});

        let checkOfficialDestination = await Post.findByIdAndUpdate(postID, {$pull: { officialChannelsArray: destination}}, {new: true});

        if(!checkArrayDestination && !checkOfficialDestination) {
            throw createError("Destinazione non nel post", 400);
        }

        if(checkArrayDestination) {
            await Channel.findOneAndUpdate({name: destination},[{$set: {'postNumber': {$subtract: ['$postNumber',1]}}}]);
        }

        if(checkArrayDestination.destinationArray.length === 0 && checkOfficialDestination.officialChannelsArray.length === 0) {
            await deletePost(postID);
        }
    }
    catch (error) {
        throw error;
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
        if(!isNaN(parseInt(destination.name))) {
            throw createError('Nome non valido',400);
        }
        await connection.get();
        let checkDestination = await Post.findOne({$and: [{$or: [{'destinationArray.name': destination.name},{'officialChannelsArray': destination.name}]}, {_id: postID}]});
        destination.name = destination.name.trim();
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

                let newFollowerNotification = channel.followers.map((follower) => {
                    return {user: follower.user, sender: 'mod', channel: channel._id};
                });

                let newAdminNotification = channel.admins.map((admin) => {
                    return {user: admin, sender: 'mod', channel: channel._id};
                });

                let creatorNotification = [{user: channel.creator, sender: 'mod', channel: channel._id}];
                let allNotification = [...newFollowerNotification, ...newAdminNotification, ...creatorNotification];

                await Notification.insertMany(allNotification);

                break;

            case 'official':
                let officialChannel = await OfficialChannel.findOne({name: destination.name});
                if(!officialChannel) {
                    throw createError('Canale Non esiste',400);
                }
                await Post.findByIdAndUpdate(postID,{$push: {officialChannelsArray: destination.name}},{new : true});
                break;

            case 'keyword':
                await Post.findByIdAndUpdate(postID,{$push: {destinationArray: destination}},{new : true});
                break;
        }


    }
    catch (error) {
        throw error
    }
}

const addPosition = async (newPosition, postID) => {
    try {
        await connection.get();
        let post = await Post.findById(postID).lean();
        let x = JSON.parse(post.content);
        console.log(x);
        if (!Array.isArray(x)) {
            x = [x];
        }
        let newContentArr = [...x, newPosition]
        let newContent = JSON.stringify(newContentArr);
        console.log("NEW CONTENT", newContent)
        if (!post) {
            throw createError(`il post con id: ${postID} non esiste`,400);
        }
        let newPost = await Post.findOneAndUpdate({_id: postID}, {content: newContent}).lean()
    }
    catch (error) {
        throw error
    }
}


const deletePost = async (postID) => {
    try{
        await connection.get()
        let post = await Post.findByIdAndRemove(postID).lean();
        await Reply.deleteMany({'parent': postID});
        return post;
    }
    catch(err){
        throw err;
    }
}




const updateReac = async (body) => {
    try{
        await connection.get()

        if(body.typeUser === 'mod') {
            let post = await Post.findByIdAndUpdate(body.postId, {$push:{reactions: {$each: JSON.parse(body.reactions)}}},{new: true});
            let creator = await User.findOne({username: post.owner})
            await UpdateCategory(post,creator._id);
            return body;
        }

        let hasReacted = (await Post.findOne({_id : body.postId, reactions:{$elemMatch:{user: body.user}}}));

        if (hasReacted){
            await Post.findByIdAndUpdate(body.postId, {$pull: {reactions: {user: body.user}}});
        }

        let post = await Post.findByIdAndUpdate(body.postId, {$push:{reactions: {rtype: body.reaction, user: body.user, date: new Date()}}});
        let creator = await User.findOne({username: post.owner})
        await UpdateCategory(post,creator._id);

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
            if(post.popularity !== 'controversial' && post.category === 'public') {
                await Post.findByIdAndUpdate(post._id, {popularity: 'controversial'});
                await addDestination({name: 'CONTROVERSIAL', destType: 'official'},post._id);
            }

        }
        else {
            if(post.popularity !== 'popular' && post.category === 'public') {
                await Post.findByIdAndUpdate(post._id, {popularity: 'popular'});
                await changePopularity(userID, 'popularity',true);
            }
        }
        return true;
    }

    if (negativeReactionsCount > criticalMass) {
        if (positiveReactionsCount > criticalMass) {
            if(post.popularity !== 'controversial' && post.category === 'public') {
                await Post.findByIdAndUpdate(post._id, {popularity: 'controversial'});
                await addDestination({name: 'CONTROVERSIAL', destType: 'official'},post._id);
            }
        }
        else {
            if(post.popularity !== 'unpopular' && post.category === 'public') {
                await Post.findByIdAndUpdate(post._id, {popularity: 'unpopular'});
                await changePopularity(userID,'unpopularity',true);
            }
        }
        return true;
    }

    if (post.popularity !== 'neutral') {
        await Post.findByIdAndUpdate(post._id, {popularity: 'neutral'});
        if (post.popularity === 'popular' && post.category === 'public') {
            await changePopularity(userID, 'popularity' ,false);
        }
        else if (post.popularity === 'unpopular' && post.category === 'public'){
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
    addDestination,
    addPosition,
    getPostHome,
    getPostByUsername2watch,
    getPostByProfile,
    getPostHomeAnonymous,
    getPostFromMention
}
