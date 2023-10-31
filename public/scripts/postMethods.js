const mongoose = require('mongoose');
const Post = require("../models/Post");
const User = require("../models/User");
const Channel = require("../models/Channel")
const {connectdb} = require("./utils");
const {ObjectId} = require("mongodb");


const addPost = async (body,credentials) => {
    try{
        await connectdb(credentials)
        let vipId = new ObjectId(await User.findOne({username: body.name},'_id')).toString()

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
    catch(err){
        console.log(err);
        throw err;
    }
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

module.exports = {
    addPost,
    getAllPost
}