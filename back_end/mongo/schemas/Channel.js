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

    requests: [
        {
            user: {
                type: String,
                required: false,
            }
        },
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
    },

    profilePicture: {
        type: String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEO0lEQVRYR62XWahVVRiAHVIbUAu1aFAvliJhgZIFqXkV0ZAQTR/K1ArsqYuhJhpNaKM0UKIPIuq1snzIFI2wEDxZCTmglIjdphsNIiSV0aSUft9hL1nu1t7n3qM/fJyz117Dv/5prd2xQ9ulK10bYRIMgSvhqmz4T/wegYOwBSpwoi1Td2xDpyvo8zjMgu65/sey51659t95fg2egqNla5Qp4I4fg3lwCfwJ78Mm2JntOOzSvlrkNpgCE+Bi+ANehqeLLFKkgLt+B26Fv2AZLIVfynYTvbuM/wthDlwEu+DOlDVSCtxAx/fgGvgI7gJ9XI8YIxtgFPwAE+HzeKK8Au58b7a4PnwAUsF0M+0j4aZsMsd8DLsTWuqeVWAMqYRjzsRFrIAdd4Bmd/F7E5P1pO3Vgnd2XwcPwW+Jsb5TCd0xJmwsVmAJjUa7Zh+X2HkP2vbDAGgFg8udK+7KYG2Ab2AoHM8p4Qa3g+4wO57wfVBA038NneA6SPl8Le33gcHpr6kWiynaDAabv/fn3vtoTHwF/8G1cDQosJyHB8FIX5QYqM8/he/AIM0vHoaohEHWH26BVEw8T7sZsgKaVEDT/AydwchPpZrmfQnmg6Yvk1p9TVGD8V/orQLjIRQYzZeSN2m8G4z8T2ooMIL3ZsRbML2gr26sFiwVCOY3Ql8vGBD83x4FmpkrFQcuMRPMtBUqUIHR0AD6OCUqZxotgBdrWOBh3r8AprGLpMQYaYUPVeALGATdoOgEMza+B33nSZjKcxeyTngi2r9v1j+lgHH3D7SogBHtQ+8aO3uD9/fAu6AJf831v5RnXXgHrIcZNeYz8LsFBfy10JifRdIlW9yg/RGsiHEhsgJeDR9kSpwsmct6Y6E6FbtAN3xZQ2t9dwg8alPiyWkV1K1lMpCXLRIH4TQaNhaMsp8RbaGKXWXQ+q5fNE53evg8mu0yNeVUGt+GahCGNPQseDLR+3raVoIpqFntvxUOQCha3oiGwViYCwa0VpgMhxNzLqbNs6CahqEQbea/xSEWo3kfXA4VsFzrgjJRYVPWA0oFVaw1N8BblcpVC1EoxQbGYDDVFHfhyTgcmqGoqKSUsay/Ak2wB7ReSHE3pVUM+GopVoIbjAFjQXkWHgGPYO8If6dWKmm7gHeWbQ+yZ8D7paLvjYEzh5GN4Tj28nk7VEBLGO0Wnm/buXjo7tHuBty9KWrF3QZeVs86jh0QLiSe18/BaogtUqcOHdYwUPfNBo96lfrfhcTJ4yuZ5r4QrGZWtXORkHJhzsIrmYvEl9JTPPeB8PFRrxKe/5Zdg7z0UhoWiK/ln9Foia3UuXoj4yzZN2aL17yWh3XiDxPbjAWP2dY2KtJAP49tza+068MkrJH/NNOHfrBoFe99/noDVrwpu0ut5687NYbq/jSLN1r2ceoCiukby3n5OM3NWc2SRjivn+enAR07/vnd3qvMAAAAAElFTkSuQmCC",
    }
})

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;