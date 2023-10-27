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

const getAllPost = async (query,credentials) =>{
    try{
        await connectdb(credentials)
        let vipId = new ObjectId(await User.findOne({username: query.name},'_id')).toString();
        console.log(vipId)
        let posts = await Post.find({'owner.Id': vipId}).limit(12).lean();

        console.log(posts)

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