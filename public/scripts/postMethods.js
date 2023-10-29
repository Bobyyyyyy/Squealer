const mongoose = require('mongoose');
const Post = require("../models/Post");
const User = require("../models/User");
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
                destType: body.destType,
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

function getSort(sortString){
    switch (sortString){
        case 'più recente':
            return {dateOfCreation: 1}
        case 'meno recente':
            return {dateOfCreation: -1}
        case 'più visual':
            return {views: -1}
        case 'meno visual':
            return {views: -1}
        /*
        Aggiungere altri sort
         */
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

        let posts = await Post.find({'owner.Id': vipId}).limit(12).sort(sorts[query.sort ?  query.sort : 'più recente']).lean();

        //console.log(posts)

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