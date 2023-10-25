const mongoose = require('mongoose');
const Post = require("../models/Post");
const {connectdb} = require("mongoose");

const addPost = async (user,body,credentials) => {
    try{
        await connectdb(credentials);
        const newPost = new Post({
            ownerId: user, //user._id,
            views: body.views,
            dateOfCreation: new Date().getTime(),
            comments: [],
            content: "pippo",       //body.content,
            contentType: "pippo",   //body.contentType,
        });

        await newPost.save();

        await mongoose.connection.close();
    }
    catch(err){
        console.log(err);
        return err;
    }
}

module.exports = {
    addPost,
}