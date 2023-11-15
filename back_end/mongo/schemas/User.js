const mongoose = require('mongoose');
const userTypes = ['user','pro','smm','vip','mod'];

//Dati di un utente al momento dell'iscrizione

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    typeUser: {
        type: String,
        enum: userTypes,
        required: true,
    },

    vipHandled: {
        type: [
            {
                type:String,        /* NAME */
            }
        ],
        required: function (){
            return this.typeUser === 'smm'
        }
    },

    characters: {
        type:{
            daily:{
                type:Number,
            },
            weekly: {
                type:Number,
            },
            monthly:{
                type:Number,
            },
        },
        required: function(){
            return this.typeUser !== 'mod';
        },
    },

    maxQuota: {
        type:{
            daily:{
                type:Number,
            },
            weekly: {
                type:Number,
            },
            monthly:{
                type:Number,
            },
        },
        required: function(){
            return this.typeUser !== 'mod';
        },
    },

    popularity: {
        type: Number,
        required: function(){
            return this.typeUser !== 'mod';
        },
    }
})

const User = mongoose.model("User", UserSchema);

module.exports = User;