const mongoose= require('mongoose');

const ReservedChannelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    posts: [
        {
            type: mongoose.Schema.ObjectId,     //post
            required: true,
        }
    ],
})

const ReservedChannel = mongoose.model("ReservedChannel", ReservedChannelSchema);

module.exports = ReservedChannel;