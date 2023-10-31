const mongoose= require('mongoose');

const ChannelSchema = new mongoose.Schema({
    name:{      /* POST DEL CANALE CARICATI A PARTIRE DAL NOME, CHIAVE PRIMARIA */
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
    ]
})

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;