const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const {connectdb,saltRounds,quota} = require("./utils");
const {json} = require("express");


//POST
const addUser = async (body,credentials) => {
    try{
        console.log(body);
        await connectdb(credentials);
        //GET user using email and name
        let findEmail =  await User.find({email: body.email}).lean();
        let findName = await User.find({username: body.name}).lean();

        if (findEmail.length !== 0 || findName.length !== 0) {
            let err = new Error("Utente già registrato!");
            err.statusCode = 400;
            console.log(err);
            await mongoose.connection.close();
            throw err;
        }

        let newUser = new User({
            username: body.name,
            email: body.email,
            password: await bcrypt.hash(body.password,saltRounds),
            typeUser: body.type,
            characters: quota,
            blocked: false,
        });

        //save new user in DB
        await newUser.save();

        await mongoose.connection.close();

        return newUser;
    }
    catch(err){
        await mongoose.connection.close();
        console.log(err);
        throw err;
    }
}

const loginUser = async (query,credentials) =>{
    try{
        await connectdb(credentials);
        //get user by username
        let user = await User.findOne({username: query.user});
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
        await mongoose.connection.close();
        throw err;
    }
}

//GET
const searchByUsername = async (query, credentials) =>{
    try {

        await connectdb(credentials);
        console.log(query);
        let user = await User.findOne({username: query.user});
        if (user.length === 0) {
            let err = new Error("Nessun utente trovato!");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            await mongoose.connection.close();
            throw err
        }

        return user;
    }
    catch (err){
        console.log(err);
        throw err;
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
        await mongoose.connection.close();
        console.log(err);
        throw err;
    }
}

const getUsers = async (query,credentials) =>{
    try {
        await connectdb(credentials);
        console.log(query);
        let offset = parseInt(query.offset);
        let limit = parseInt(query.limit);
        return await User.find({$or : [{username: {$regex: query.filter , $options: 'i'}},{email: {$regex: query.filter , $options: 'i'}},{typeUser: {$regex: query.filter , $options: 'i'}}, ] } ).skip(offset).limit(limit);
    }
    catch (err){
        throw err;
    }
}

const usersLength = async (query,credentials) => {
    try {
        await connectdb(credentials);
        let users = await User.find({$or : [{username: {$regex: query.filter , $options: 'i'}},{email: {$regex: query.filter , $options: 'i'}},{typeUser: {$regex: query.filter , $options: 'i'}},]});
        return {length: users.length};
    }
    catch (Error){
        throw Error;
    }
}

const altUser = async (body,credentials) => {
    try {
        console.log(body);
        await connectdb(credentials);
        let user = await User.findOneAndUpdate(
            {username: {$regex: body.filter , $options: 'i'}},
            {blocked: body.blocked,
            'characters.daily':  parseInt(body.characters.daily),
            'characters.weekly':  parseInt(body.characters.weekly),
            'characters.monthly':  parseInt(body.characters.monthly)},
            {new: true});
        console.log(user);
        return user;
    }
    catch (Error){
        throw Error;
    }
}

//GET
const getHandledVip = async (query,credentials) => {
    try{
        await connectdb(credentials);
        let SMM = await User.findOne({username: query.SMMname})
        console.log(SMM)
        const vips = SMM.vipHandled;
        console.log(vips)
        let vipsAcc = await Promise.all(vips.map(async (vip)=>{
            return await User.findById(vip)
        }))

        console.log(vipsAcc)
        return vipsAcc
    }
    catch (Error){
        throw Error;
    }
}



//manca un delete per provare le principali API

module.exports = {
    addUser,
    searchByUsername,
    changePwsd,
    loginUser,
    getUsers,
    usersLength,
    altUser,
    getHandledVip
}