const mongoose = require('mongoose');
const Post = require("../models/Post");
const User = require("../models/User");
const {connectdb} = require("./utils");


const addPost = async (body,credentials) => {
    try{
        await connectdb(credentials)

        let newPost = new Post({
            ownerId: (await User.findOne({username: body.name}))._id.toString(),
            destination:{
                destType: 'user',
                receiver: (await User.findOne({username: body.receiver}))._id.toString(),
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
        return err;
    }
}

module.exports = {
    addPost,
}