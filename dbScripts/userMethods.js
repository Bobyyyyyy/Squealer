const mongoose = require('mongoose');
const dbname = "db";
const User = require("../models/User");

//POST
const addUser = async (body,credentials) => {
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

//GET
const searchByUsername = async (query, credentials) =>{
    try {
        const mongouri = `mongodb://localhost:27017/${dbname}`;
        await mongoose.connect(mongouri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        let result = await User.find(query).lean();
        if (result.length === 0) {
            let err = new Error("Nessun utente trovato!");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            await mongoose.connection.close();
            return err;
        }
        await mongoose.connection.close();

        return result;
    }
    catch (err){
        console.log(err);
        return err;
    }
}

module.exports = {
    addUser,
    searchByUsername,
}