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

/*
##########
#  USER  #
##########
*/

//va qui?
//https://stackoverflow.com/questions/70229333/creating-an-instance-in-mongoose
//da capire come gestire le credenziali

//POST
exports.addUser = async (body,credentials) => {

    try{
        //const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
        const mongouri = `mongodb://localhost:27017/${dbname}`;
        await mongoose.connect(mongouri, {       //https://stackoverflow.com/questions/74218532/possible-to-have-mongoose-return-a-connection
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        const newUser = new User({
            username: body.name,
            email: body.email,
            password: body.password,
        })

        if (await User.find({email: body.email})) {
            let err = new Error("Utente già registrato! Inserire una nuova mail");
            err.statusCode = 400;
            console.log(err);
            return err;
        }

        await newUser.save();

        //debug console.log(newUser)

        await mongoose.connection.close();

    }
    catch(err){
        console.log(err);
        return err;
    }
}

exports.getUserByEmail = async (query,credentials) =>{
    //const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
    const mongouri = `mongodb://localhost:27017/${dbname}/Users`;
    try {
        await mongoose.connect(mongouri,{
            useUnifiedTopology: true,
            useNewUrlParser: true
        })

        const user = await User.find(query).lean();    //lean restituisce un oggetto JS

        console.log(user);

        await mongoose.connection.close();

        return user;
    }
    catch (err){
        return err;
    }
}


//https://stackoverflow.com/questions/74242292/how-to-return-documents-in-mongoose-and-express-js-which-are-associated-with-onl