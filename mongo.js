const mongoose = require('mongoose');
const dbname = "db";
const User = require("./models/User.js");

/*
Non ha senso creare un DB. Mongo funziona così:
- un dataBase esiste solo se c'è qualcosa dentro. Dunque al primo inserimento viene creato
- un DB contiene molteplici collezioni (canali, post, utenti)
- ogni collezione contiene molteplici Documenti (che sono le istanze della collezione)
usare la funzione insert_one per inserire
Dunque funzione di creazione del DB non ha senso.
 */

//connessione
exports.createUserDB = async (credentials) => {
    try{
       //const mongoDBuri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
       const mongoDBuri = `mongodb://localhost:27017/${UserdbName}`;
        await mongoose.connect(mongoDBuri,{
            useUnifiedTopology: true, 
            useNewUrlParser: true 
        })
        //debug
        console.log("DB connected");


    }
    catch(err){
        console.log(err);
    }
}

//va qui?
//https://stackoverflow.com/questions/70229333/creating-an-instance-in-mongoose
exports.addUser = async(req,res) => {
    try{
        //const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
        const mongouri = `mongodb://localhost:27017/${dbname}/Users`;
        await mongoose.connect(mongouri,{       //https://stackoverflow.com/questions/74218532/possible-to-have-mongoose-return-a-connection
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })

        await newUser.save();

        await mongoose.connection.close();
        //gestire i vari casi in base al valore di ritorno della risposta
    }
    catch(err){
        console.log(err);
    }
}