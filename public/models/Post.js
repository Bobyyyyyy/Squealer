const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");
const contentTypes = ['geolocation','text','image']
const destTypes = ['channel', 'user','official']
const reactionTypes = ['heart','thumbs-up','thumbs-down','heartbreak']

const PostSchema = new mongoose.Schema({
    owner: {
        type: String,       //NAME
        required: true,
    },
    destination:{
        destType: {
            type: String,
            enum: destTypes,
        },
        isPublic: {     // DA INSERIRE SOLO SE CANALE
            type: Boolean,
            required: function(){
                return this.destination.destType === 'channel'
            }
        },
        name:{
            type: String,
            required: true,
        }
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
            rtype:{     //reaction type
                type: String,
                enum: reactionTypes,
            },
            user: String,       //NOME
            date: Date,
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