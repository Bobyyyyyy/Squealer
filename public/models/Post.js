const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");
const contentTypes = ['geoloc','text','image']
const destTypes = ['channel', 'user']
const reactionTypes = ['love','like','meh','disagreement','hate']

const PostSchema = new mongoose.Schema({
    owner: {
        Id:{
            type: String,
            required: true,
        },
        name:{
            type: String,
            required: true,
        }
    },
    destination:{
        dest:{
            destType: {
                type: String,
                enum: destTypes,
            },
            isPublic: {     // DA INSERIRE SOLO SE CANALE
                type: Boolean,
                required: false,        //METTERE REQUIRED SE CANALE
            }
        },
        receiver: {
            id:{
                type: String,
                required: true,
            },
            name:{
                type: String,
                required: true,
            }
        },
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