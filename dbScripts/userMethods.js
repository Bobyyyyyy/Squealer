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
        let user = User.find({username: query.name});

        //check if user exists
        if (user.length === 0){
            let err = new Error("Nessun utente trovato!");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            await mongoose.connection.close();
            return err;
        }

        await mongoose.connection.close();

        //check if passwd is right
        const match = await bcrypt.compare(query.password,user.password);
        if (!match){
            let err = new Error("Password Sbagliata!");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            return err;
        }

        return user;
    }
    catch (err){
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
    changePswd,
}