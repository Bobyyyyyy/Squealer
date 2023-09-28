const mongoose = require('mongoose');
const Post = require("../models/Post");

const addPost = async (user,body,credentials) => {
    try{
        //const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
        const mongouri = `mongodb://localhost:27017/${dbname}`;
        await mongoose.connect(mongouri, {       //https://stackoverflow.com/questions/74218532/possible-to-have-mongoose-return-a-connection
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

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