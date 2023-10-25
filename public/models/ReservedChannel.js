const mongoose= require('mongoose');

const ReservedChannelSchema = new mongoose.Schema({
    name:{
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

    followers: {
        type: {
            users: [
                {
                    type: String,     //utenti
                    required: true,
                }
            ],
        },
        required: true
    },

    administrators: {
        type: {
            users: [
                {
                    type: String,     //utenti
                    required: true,
                }
            ],
        },
        required: true
    }
})

const ReservedChannel = mongoose.model("ReservedChannel", ReservedChannelSchema);

module.exports = ReservedChannel;