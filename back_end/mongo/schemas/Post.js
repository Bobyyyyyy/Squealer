const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");
const contentTypes = ['geolocation','text','image']
const destTypes = ['channel', 'user','official']
const reactionTypes = ['heart','thumbs-up','thumbs-down','heartbreak']
const categories = ['private','public','popular','unpopular','controversial'];

const PostSchema = new mongoose.Schema({
    owner: {
        type: String,       //NAME
        required: true,
    },

    destinationArray: [
        {
            destType: {
                type: String,
                enum: destTypes,
            },
            name: {
                type: String,
                required: true,
            }
        }
    ],

    officialChannelsArray: [
        {
                type: String,
                required: true,
        }
    ],

    category: {
            type: String,
            required: true,
            enum: categories,
    },

    contentType:{
        type: String,       //geolocalizzazione, immagine o testo
        enum: contentTypes,
        required: true,
    },

    content:{
        type: String,
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

    criticalMass: {
        type: Number,
        default: 0,
    },

    views: {
        type: Number,
        default: 0,
    },


    //TODO
    tag: {
        type: String,
    },

})

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;