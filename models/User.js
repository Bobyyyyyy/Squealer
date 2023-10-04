const mongoose = require('mongoose');

//Dati di un utente al momento dell'iscrizione

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

   /* dailyCh: {
        type: Number,
        required: true,
    },

    weeklyCh: {
        type: Number,
        required: true,
    },

    monthlyCh: {
        type: Number,
        required: true,
    },

    */
})

const User = mongoose.model("User", UserSchema);

module.exports = User;