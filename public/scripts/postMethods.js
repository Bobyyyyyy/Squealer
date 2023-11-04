const mongoose = require('mongoose');
const Post = require("../models/Post");
const User = require("../models/User");
const Channel = require("../models/Channel")
const {connectdb, createError} = require("./utils");

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
            content: body.post.content,
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

        return body;
    }
    catch(err){ throw err; }
}

const getAllPost = async (query,credentials) =>{
    try{

        await connectdb(credentials)

        let filter = {
                /* Per i canali non mi serve l'id dell'utente che fa la richiesta */
            ...(!query.channel) && {'owner':  query.name},
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

const updateReac = async (body,credentials) => {
    try{
        await connectdb(credentials);
        let hasReacted = (await Post.findOne({_id : body.postId, reactions:{$elemMatch:{user: body.user}}}));

        if (hasReacted){
            await Post.findByIdAndUpdate(body.postId, {$pull: {reactions: {user: body.user}}});
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

module.exports = {
    addPost,
    getAllPost,
    updateReac,
    deleteReac
}