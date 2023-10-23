const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");

const PostSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    contentType:{
        type: String,       //geolocalizzazione, immagine o testo
        required: true,
    },
    content:{
        type: String,       // ?
        required: true,
    },
    reactions:{
        love:{
            type: Number,
        },
        like:{
            type: Number,
        },
        meh: {
            type: Number,
        },
        disagreement:{
            type: Number,
        },
        hate: {
            type: Number
        }
        //cambiare nomi
    },
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
    comments: [
        {
            body:{
                type: String,
                required: true,
            },
            owner: {
                type: mongoose.Schema.ObjectId, //id utente, si può usare la find_by id
                required: true,
            },
            dateOfCreation: {
                type: Date,
                required: true,
            },
        }
        ]
})

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;