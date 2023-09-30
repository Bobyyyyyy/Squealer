const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const {connectdb,saltRounds} = require("./utils");

//POST
const addUser = async (body,credentials) => {
    try{

        await connectdb(credentials);

        const newUser = new User({
            username: body.name,
            email: body.email,
            password: await bcrypt.hash(body.password,saltRounds),
        });

        let findResult =  await User.find({email: body.email}).lean();

        if (findResult.length !== 0) {
            let err = new Error("Utente già registrato! Inserire una nuova mail");
            err.statusCode = 400;
            console.log(err);
            await mongoose.connection.close();
            return err;
        }

        //aggiungere controllo username per non avere utenti con stesso nome

        await newUser.save();

        await mongoose.connection.close();

        return newUser;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

const loginUser = async (query,credentials) =>{
    try{
        await connectdb(credentials);
        //get user by username
        let user = await User.findOne({username: query.user});
        console.log(query);
        console.log(user);
        //check if user exists
        if (!user){
            let err = new Error("Nessun utente trovato!");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            await mongoose.connection.close();
            throw err;
        }

        //check if passwd is right
        const match = await bcrypt.compare(query.password, user.password);
        console.log(match);
        if (!match){
            let err = new Error("Password Sbagliata!");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            await mongoose.connection.close();
            throw err;
        }

        await mongoose.connection.close();
        return user;
    }
    catch (err){
        throw err;
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
const changePwsd = async(body,credentials) =>{
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
        user.password = await bcrypt.hash(body.password,saltRounds);

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
    changePwsd,
    loginUser,
}