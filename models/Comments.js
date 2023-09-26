const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");

const CommentsSchema = new mongoose.Schema({
    idPost: { //per identificare il post in questione
        type: ObjectId,
        required: true
    },
    body:{
        type: String,
        required: true,
    },
    owner: { //si tratta di un utente
        type: String,       //vedere se usare id
        required: true,
    }
})

const Comments= mongoose.model("Comments", CommentsSchema);

module.exports = Comments;