const mongoose = require('mongoose');
const Post = require("./models/Post");
const {connectdb} = require("mongoose");

const addPost = async (user,body,credentials) => {
    try{
        await connectdb(credentials);
        const newPost = new Post({
            ownerId: user, //user._id,      capire il concetto di sessione per capire come prendere l'id di chi scrive il post
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