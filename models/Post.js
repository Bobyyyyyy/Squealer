const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");

const PostSchema = new mongoose.Schema({
    //non creo il campo id, esiste già di base: _id
    ownerNick: {
        type: ObjectId,
        required: true,
    },
    reaction:{
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
    }
})