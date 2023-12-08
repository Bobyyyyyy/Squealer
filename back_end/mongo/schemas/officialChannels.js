const mongoose= require('mongoose');

const ReservedChannelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    creator: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true
    },

    silenceable: {
        type: Boolean,
        required: true,
    },

    silenced: [
        {
            type: String,
            required: false,
        }
    ]


})

const OfficialChannels = mongoose.model("OfficialChannels", ReservedChannelSchema);

module.exports = OfficialChannels;