const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const User = require("../schemas/User");
const {connectdb,saltRounds,quota} = require("./utils");
const {json} = require("express");
const Post = require("../schemas/Post");


//POST
const addUser = async (body,credentials) => {
    try{
        await connectdb(credentials);
        //GET user using email and name
        let findName = await User.find({username: body.name}).lean();

        if (findName.length !== 0) {
            let err = new Error("Utente già registrato!");
            err.statusCode = 400;
            console.log(err);
            await mongoose.connection.close();
            throw err;
        }

        let newUser = new User({
            username: body.name,
            password: await bcrypt.hash(body.password,saltRounds),
            typeUser: body.type ? body.type : 'user',
            characters: body.type === 'mod' ? {daily: null, weekly: null, monthly: null} : quota,
            ...(body.type === 'smm') && {vipHandled: []},
            maxQuota: body.type === 'mod' ? {daily: null, weekly: null, monthly: null} : quota,
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
        let user = await User.findOne({username: query.user}).lean();
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
        let user = await User.findOne({username: query.username}).lean();
        if (!user) {
            let err = new Error("Nessun utente trovato!");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            await mongoose.connection.close();
            throw err;
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
        let offset = parseInt(query.offset);
        let limit = parseInt(query.limit);
        return await User.find({$or : [{username: {$regex: query.filter , $options: 'i'}},{email: {$regex: query.filter , $options: 'i'}},{typeUser: {$regex: query.filter , $options: 'i'}}, ] } ).skip(offset).limit(limit).lean();
    }
    catch (err){
        throw err;
    }
}

const usersLength = async (query,credentials) => {
    try {
        await connectdb(credentials);
        let users = await User.find({$or : [{username: {$regex: query.filter , $options: 'i'}},{email: {$regex: query.filter , $options: 'i'}},{typeUser: {$regex: query.filter , $options: 'i'}},]}).lean();
        await mongoose.connection.close();
        return {length: users.length};
    }
    catch (Error){
        throw Error;
    }
}

const altUser = async (body,credentials) => {
    try {
        await connectdb(credentials);
        let user = await User.findOneAndUpdate(
            {username: {$regex: body.filter , $options: 'i'}},
            {blocked: body.blocked,
            'characters.daily':  parseInt(body.characters.daily),
            'characters.weekly':  parseInt(body.characters.weekly),
            'characters.monthly':  parseInt(body.characters.monthly)},
            {new: true}).lean();
        await mongoose.connection.close();
        return user;
    }
    catch (Error){
        throw Error;
    }
}

//GET
const getHandledVip = async (query,credentials) => {
    try {
        await connectdb(credentials);
        let vipHandled = (await User.findOne({username: query.SMMname},'vipHandled')).vipHandled;

        await mongoose.connection.close();

        return vipHandled
    }
    catch (Error){
        throw Error;
    }
}

const getUserQuota = async (query,credentials) => {
    try {
        await connectdb(credentials);
        let quota = (await User.findOne({username: query.user},'characters')).characters;
        await mongoose.connection.close();

        return quota;
    }
    catch (Error){
        throw Error;
    }
}

const get_n_FollnPosts = async(body,credentials) => {
    try{
        await connectdb(credentials);

        let posts = await Post.find({owner: body.user});

        await mongoose.connection.close();

        return {nposts: posts.length};
    }
    catch (err){
        throw err;
    }
}


const resetQuota = async (type, credentials) => {
    try{
        await connectdb(credentials);

        switch (type){
            case 'D':
                await User.updateMany({typeUser: {$not: {$eq:'mod'}}},[{$set: {"characters.daily": "$maxQuota.daily"}}])
                break;
            case 'W':
                await User.updateMany({typeUser: {$not: {$eq:'mod'}}},[{$set: {"characters.weekly": "$maxQuota.weekly"}}])
                break;
            case 'M':
                await User.updateMany({typeUser: {$not: {$eq:'mod'}}},[{$set: {"characters.monthly": "$maxQuota.monthly"}}])
                break;
        }

        await mongoose.connection.close();

    }catch (e) {
        console.log(e)
    }
}


/**
 * @param {String} userID
 * @param {Boolean} increase
 * @returns {Promise<boolean>}
 */

const changePopularity = async (userID, increase) => {
    let user = await User.findById(userID, 'popularity');
    let popularity = user.popularity;

    if(increase) {
        popularity++;
        await User.findByIdAndUpdate(userID, {'popularity': popularity});
    }
    else {
        popularity--;
        await User.findByIdAndUpdate(userID, {'popularity': popularity});
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
    getHandledVip,
    getUserQuota,
    get_n_FollnPosts,
    resetQuota,
    changePopularity,
}