const mongoose= require('mongoose');

const ChannelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    description: {
        type: String,
    },


    isPublic: {
        type: Boolean,
        required: true,
    },

    posts: [
        {
            type: String,       //ID del post
            required: true
        }
    ],

    /* primo proprietario */
    creator: {
      type: String,
      required: true,
    },

    /* Altri utenti che sono proprietari */
    /* Possono aggiungere utenti agli scrittori/accettare nei canali privati */

    admins: [
        {
            type:String,
            required: true,
        }
    ],

    followers:[
        {
            user: {
                type: String,
                required: true,
            },
            canWrite: {
                type: Boolean,
                required: true,
            }
        }
    ]
})

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;