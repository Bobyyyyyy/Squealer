const mongoose = require('mongoose');
const User = require("../models/User");
const {connectdb} = require("./utils");


//POST
const addUser = async (body,credentials) => {
    try{
        await connectdb(credentials);

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

        await connectdb(credentials);

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

//PUT
const changePswd = async(body,credentials) =>{
    try{
        await connectdb(credentials);
        let user = await User.find({email: body.email});    //query o body??

        if (user.length === 0) {
            let err = new Error("Mail inesistente");
            err.statusCode = 400;
            console.log(err);
            await mongoose.connection.close();
            return err;
        }
        user.password = body.password;

        await user.save();

        await mongoose.connection.close()
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

//manca un delete per provare le principali API

module.exports = {
    addUser,
    searchByUsername,
    changePswd,
}