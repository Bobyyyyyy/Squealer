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

    postList: {
        type: {
            posts: [{
                type: String,     //post
            }
            ],
        },
        required: true
    },

    administrators: {
        type: {
            users: [
                    {
                        type: String,
                        required: true,
                    }
            ],
        },
        required: true
    }
})

const ReservedChannel = mongoose.model("ReservedChannel", ReservedChannelSchema);

module.exports = ReservedChannel;