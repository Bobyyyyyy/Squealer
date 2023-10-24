const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");
const contentTypes = ['geoloc','text','img']
const reactionTypes = ['love','like','meh','disagreement','hate']

const PostSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    contentType:{
        type: String,       //geolocalizzazione, immagine o testo
        enum: contentTypes,
        required: true,
    },
    content:{
        type: String,       // ?
        required: true,
    },
    reactions: [
        {
            user: mongoose.Schema.ObjectId,
            type: String,
            enum: reactionTypes,
        },
    ],
    dateOfCreation:{
        type: Date,
        required: true,
    },
    views: {
        type: Number,
    },
    tag: {
        type: String,
    },
})

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;