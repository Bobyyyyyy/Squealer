const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");
const contentTypes = ['geolocation','text','image']
const destTypes = ['channel', 'user','official']
const reactionTypes = ['heart','thumbs-up','thumbs-down','heartbreak']
const categories = ['private','public'];
const popularities = ['popular','unpopular','controversial','neutral']

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

    popularity: {
        type: String,
        required: true,
        enum: popularities,
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
        default: 5,
    },

    views: [{
        name: String,
        date: Date,
    }],


    tags: [
        {
            type: String,
        }
    ],

})

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;