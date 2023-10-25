const mongoose= require('mongoose');

const ChannelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    public: {
        type: Boolean,
        required: true,
    },
})

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;