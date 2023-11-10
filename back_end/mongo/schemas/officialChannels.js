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
})

const OfficialChannels = mongoose.model("OfficialChannels", ReservedChannelSchema);

module.exports = OfficialChannels;