const mongoose = require('mongoose');
const Post = require("../models/Post");
const User = require("../models/User");
const Channel = require("../models/Channel")
const {connectdb, createError, sorts} = require("./utils");


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


        let newPost = new Post({
            owner: body.name,
            destination:{
                destType: body.destType,
                name: body.receiver,
                ...(body.destType === 'channel') && {
                    isPublic: (await Channel.findOne({name: body.receiver},'isPublic')).isPublic
                },
            },
            contentType: body.contentType,
            content: body.content,
            reactions: [],
            dateOfCreation: body.dateOfCreation,
        })

        await newPost.save();
        await mongoose.connection.close();

        return newPost
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