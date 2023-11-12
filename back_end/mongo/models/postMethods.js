const mongoose = require('mongoose');
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Channel = require("../schemas/Channel")
const ReservedChannel = require("../schemas/officialChannels");
const {connectdb, createError, mongoCredentials} = require("./utils");

const find_remove = (arr,id) => {
    let index = arr.findIndex(obj => obj['id'] === id);
    let el2ret = arr[index];
    arr.splice(index,1);
    return el2ret;
}

/**
 *
 * @param {Array} scheduledPostArr
 * @param {ObjectId} postId
 */
const removeScheduledPost = (scheduledPostArr, postId) => {
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
        console.log("ENTRO");
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

const addTimedPost = async (postId, scheduledArray, credentials) => {
    try {
        await connectdb(credentials);

        let post = await Post.findById(postId);
        let userQuota = (await User.findOne({username: post.owner})).characters;

        await mongoose.connection.close();

        let timedInfo = scheduledArray.find(el => el['id']===postId);

            /* same structure of body passed in addPost */
        let newPost = {
            name: post.owner,
            destType: post.destination.destType,
            receiver: post.destination.name,
            contentType: post.contentType,
            dateOfCreation: Date.now(),
            content: post.contentType === 'text' ? parseText(timedInfo.content,timedInfo.done + 1) : post.content
        }


        let quota2del = newPost.destType === 'user' ? 0 : (post.contentType === 'text' ? newPost.content.length : 125);
        //GESTIRE CASI IN CUI NON PUO' INSERIRE
        let id = await addPost({
            post: newPost,
            quota:{
                daily: userQuota.daily - quota2del,
                weekly: userQuota.weekly - quota2del,
                monthly: userQuota.monthly - quota2del,
            }
        }, credentials);

        //check se id restituisce errore;

        let idx = scheduledArray.findIndex(el =>  el['id']===postId );
        scheduledArray[idx].done += 1;
        console.log(scheduledArray[idx].done);
        console.log(postId);
        if(scheduledArray[idx].done === scheduledArray[idx].allTimes) removeScheduledPost(scheduledArray,postId);

        return {newPostId : id};

    }catch (err) {
        console.log(err);
    }
}

const addPost = async (body,credentials) => {
    try{
        await connectdb(credentials)

        /* ERROR HANDLING */
        /* utente non esiste  */
        if(body.destType === 'user' && !(await User.findOne({username: body.receiver})) ){
            await mongoose.connection.close();
            throw createError("utente non esistente!",422);
        }
        /* canale non esiste  */
        else if(body.destType === 'channel' && !(await Channel.findOne({name: body.receiver}))){
            await mongoose.connection.close();
            throw createError("canale non esistente!",422);
        }
        /* canale ufficiale non esiste e l'utente non mod*/
        else if(body.destType === 'official' && (!(await ReservedChannel.findOne({name: body.receiver}))
            || (await User.findOne({username: body.name},'typeUser')).typeUser !== 'mod')){
            await mongoose.connection.close();
            throw createError("canale ufficiale non esistente o utente non moderatore!",422);
        }
        /* tipo di destinatario non inserito */
        else if (body.destType === 'receiver'){     /* DA VEDERE CON ALE COME MODIFICARE */
            await mongoose.connection.close();
            throw createError("Inserisci il tipo di destinatario!",422);
        }

        /* POST SAVE */
        let newPost = new Post({
            owner: body.post.name,
            destination:{
                destType: body.post.destType,
                name: body.post.receiver,
                ...(body.post.destType === 'channel') && {
                    isPublic: (await Channel.findOne({name: body.post.receiver},'isPublic')).isPublic
                },
            },
            contentType: body.post.contentType,
            content: (body.post.timed && body.post.contentType === 'text') ? parseText(body.post.content, 1) : body.post.content,
            reactions: [],
            dateOfCreation: body.post.dateOfCreation,
        })

        await newPost.save();

        /* QUOTA UPDATE */
        await User.findOneAndUpdate({username: body.post.name}, {
            characters:{
                daily: body.quota.daily,
                weekly: body.quota.weekly,
                monthly: body.quota.monthly,
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
            ... (query.destType && query.destType !== 'all') && {'destination.destType': query.destType === 'user' ? 'user' : 'channel'},
            ... (query.destType && query.destType !== 'all' && query.destType !== 'user') && {'destination.isPublic': query.destType === 'public'},

                /* PER IL CANALE SINGOLO */
            ...(query.channel) && {'destination.name': query.channel}
        }


        let posts = await Post.find(filter)
            .skip(parseInt(query.offset))
            .limit(12)
            .sort(sorts[query.sort ?  query.sort : 'più recente'])
            .lean();

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

        if(await User.findOne({username: body.user},'typeUser').typeUser !== 'mod') {
            let hasReacted = (await Post.findOne({_id : body.postId, reactions:{$elemMatch:{user: body.user}}}));

            if (hasReacted){
                await Post.findByIdAndUpdate(body.postId, {$pull: {reactions: {user: body.user}}});
            }
        }

        await Post.findByIdAndUpdate(body.postId, {$push:{reactions: { rtype: body.reaction, user: body.user, date: new Date()}}});

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

        console.log(query.user);

        let posts = await Post.find({owner: query.user}).sort(sorts['più recente']).limit(1);

        await mongoose.connection.close();
        return posts[0];
    }
    catch (err){
        throw err;
    }
}

module.exports = {
    addPost,
    getAllPost,
    deletePost,
    updateReac,
    deleteReac,
    getLastPostUser,
    addTimedPost
}