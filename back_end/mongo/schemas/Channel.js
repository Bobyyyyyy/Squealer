const mongoose= require('mongoose');
const channelTypes = ['public','private'];

const ChannelSchema = new mongoose.Schema({
    name:{      /* POST DEL CANALE CARICATI A PARTIRE DAL NOME, CHIAVE PRIMARIA */
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    type: {
        type: String,
        required: true,
        enum: channelTypes
    },

    /* primo proprietario */
    creator: {
      type: String,     /* NAME */
      required: true,
    },

    /* Altri utenti che sono proprietari */
    /* Possono aggiungere utenti agli scrittori/accettare nei canali privati */
    admins: [
        {
            type:String,    /* NAME */
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
    ],

    followerNumber: {
        type: Number,
        default: 0
    },

    postNumber: {
        type: Number,
        default: 0
    },

    isBlocked: {
        type: Boolean,
        default: false
    }
})

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;