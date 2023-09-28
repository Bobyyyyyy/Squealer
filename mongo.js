const mongoose = require('mongoose');
const dbname = "db";
const User = require("./models/User");
const Post = require("./models/Post");
const {ObjectId} = require("mongodb");

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

//da capire come gestire le credenziali



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
        });

        let findResult =  await User.find({email: body.email}).lean();

        if (findResult.length !== 0) {
            let err = new Error("Utente già registrato! Inserire una nuova mail");
            err.statusCode = 400;
            console.log(err);
            await mongoose.connection.close();
            return err;
        }
        await newUser.save();

        await mongoose.connection.close();

        return newUser;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

exports.getUserByEmail = async (query,credentials) =>{
    //const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
    const mongouri = `mongodb://localhost:27017/${dbname}`;
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


/*
##########
#  POST  #
##########
*/

exports.addPost = async (user,body,credentials) => {
    try{
        //const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
        const mongouri = `mongodb://localhost:27017/${dbname}`;
        await mongoose.connect(mongouri, {       //https://stackoverflow.com/questions/74218532/possible-to-have-mongoose-return-a-connection
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        //User.find()

        const newPost = new Post({
            ownerId: user, //user._id,      capire il concetto di sessione per capire come prendere l'id di chi scrive il post
            views: body.views,
            dateOfCreation: new Date().getTime(),
            comments: [],
            content: "pippo",       //body.content,
            contentType: "pippo",   //body.contentType,
        });

        await newPost.save();

        await mongoose.connection.close();
    }
    catch(err){
        console.log(err);
        return err;
    }
}