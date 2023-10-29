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
            owner: {
                Id: vipId,
                name: body.name,
            },
            destination:{
                dest:{
                    destType: body.destType,
                    ...(body.destType === 'channel') && {
                        isPublic: (await Channel.findOne({name: body.receiver},'isPublic')).isPublic
                    }

                },
                receiver: {
                    id: new ObjectId(await User.findOne({username: body.receiver},'_id')).toString(),
                    name: body.receiver
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

        let vipId = new ObjectId(await User.findOne({username: query.name},'_id')).toString();

        let filter = {'owner.Id': vipId,
            ... (query.typeFilter && query.typeFilter !== 'all') && {'contentType': query.typeFilter},
            ... (query.destType && query.destType !== 'all') && {'destination.dest.destType': query.destType === 'user' ? 'user' : 'channel'},
            ... (query.destType && query.destType !== 'all' && query.destType !== 'user') && {'destination.dest.isPublic': query.destType === 'public'} }

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