const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    owner: {
        type: String,       //NAME
        required: true,
    },
    content:{
        type: String,       //SOLO TESTO PER ORA
        required: true,
    },
    dateOfCreation:{
        type: Date,
        required: true,
    },
    parent:{
        type: String,   //ID post padre
        required: true,
    }
})

const Reply = mongoose.model("Reply", ReplySchema)

module.exports = Reply;