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

        let defalutImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEO0lEQVRYR62XWahVVRiAHVIbUAu1aFAvliJhgZIFqXkV0ZAQTR/K1ArsqYuhJhpNaKM0UKIPIuq1snzIFI2wEDxZCTmglIjdphsNIiSV0aSUft9hL1nu1t7n3qM/fJyz117Dv/5prd2xQ9ulK10bYRIMgSvhqmz4T/wegYOwBSpwoi1Td2xDpyvo8zjMgu65/sey51659t95fg2egqNla5Qp4I4fg3lwCfwJ78Mm2JntOOzSvlrkNpgCE+Bi+ANehqeLLFKkgLt+B26Fv2AZLIVfynYTvbuM/wthDlwEu+DOlDVSCtxAx/fgGvgI7gJ9XI8YIxtgFPwAE+HzeKK8Au58b7a4PnwAUsF0M+0j4aZsMsd8DLsTWuqeVWAMqYRjzsRFrIAdd4Bmd/F7E5P1pO3Vgnd2XwcPwW+Jsb5TCd0xJmwsVmAJjUa7Zh+X2HkP2vbDAGgFg8udK+7KYG2Ab2AoHM8p4Qa3g+4wO57wfVBA038NneA6SPl8Le33gcHpr6kWiynaDAabv/fn3vtoTHwF/8G1cDQosJyHB8FIX5QYqM8/he/AIM0vHoaohEHWH26BVEw8T7sZsgKaVEDT/AydwchPpZrmfQnmg6Yvk1p9TVGD8V/orQLjIRQYzZeSN2m8G4z8T2ooMIL3ZsRbML2gr26sFiwVCOY3Ql8vGBD83x4FmpkrFQcuMRPMtBUqUIHR0AD6OCUqZxotgBdrWOBh3r8AprGLpMQYaYUPVeALGATdoOgEMza+B33nSZjKcxeyTngi2r9v1j+lgHH3D7SogBHtQ+8aO3uD9/fAu6AJf831v5RnXXgHrIcZNeYz8LsFBfy10JifRdIlW9yg/RGsiHEhsgJeDR9kSpwsmct6Y6E6FbtAN3xZQ2t9dwg8alPiyWkV1K1lMpCXLRIH4TQaNhaMsp8RbaGKXWXQ+q5fNE53evg8mu0yNeVUGt+GahCGNPQseDLR+3raVoIpqFntvxUOQCha3oiGwViYCwa0VpgMhxNzLqbNs6CahqEQbea/xSEWo3kfXA4VsFzrgjJRYVPWA0oFVaw1N8BblcpVC1EoxQbGYDDVFHfhyTgcmqGoqKSUsay/Ak2wB7ReSHE3pVUM+GopVoIbjAFjQXkWHgGPYO8If6dWKmm7gHeWbQ+yZ8D7paLvjYEzh5GN4Tj28nk7VEBLGO0Wnm/buXjo7tHuBty9KWrF3QZeVs86jh0QLiSe18/BaogtUqcOHdYwUPfNBo96lfrfhcTJ4yuZ5r4QrGZWtXORkHJhzsIrmYvEl9JTPPeB8PFRrxKe/5Zdg7z0UhoWiK/ln9Foia3UuXoj4yzZN2aL17yWh3XiDxPbjAWP2dY2KtJAP49tza+068MkrJH/NNOHfrBoFe99/noDVrwpu0ut5687NYbq/jSLN1r2ceoCiukby3n5OM3NWc2SRjivn+enAR07/vnd3qvMAAAAAElFTkSuQmCC"

        let newUser = new User({
            username: body.name,
            password: await bcrypt.hash(body.password,saltRounds),
            typeUser: body.type ? body.type : 'user',
            profilePicture: defalutImage,
            characters: body.type === 'mod' ? {daily: null, weekly: null, monthly: null} : quota,
            ...(body.type === 'smm') && {vipHandled: []},
            maxQuota: body.type === 'mod' ? {daily: null, weekly: null, monthly: null} : quota,
            popularity: body.type === 'mod' ? null : 0,
            unpopularity: body.type === 'mod' ? null : 0,
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

/**
 * @param {String} username
 * @param credentials
 * @returns {Promise<void>}
 */
const getUserProfilePicture = async (username, credentials) => {
    try {
        await connectdb(credentials);
        let user = await User.findOne({username: username}).lean();
        console.log("user da getUserProfPic", user.profilePicture);
        let pic = {profilePic: user.profilePicture};
        return pic;
    } catch (err) {
        console.log(err);
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

const changeProfilePic = async(body,credentials) => {
    try{
        await connectdb(credentials);
        let user = await User.find({username: body.username});    //query o body??

        if (user.length === 0) {
            let err = new Error("User non esite");
            err.statusCode = 400;
            console.log(err);
            await mongoose.connection.close();
            return err;
        }
        user.profilePicture = await body.newProfilePic;

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
            'characters.monthly':  parseInt(body.characters.monthly),
            },
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
        let quota = (await User.findOne({username: query.user},'characters maxQuota')).lean();
        await mongoose.connection.close();

        delete quota._id;
        console.log("quota", quota);
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
 * @param {String} valueToModify
 * @param {Boolean} increaseValue
 * @returns {Promise<boolean>}
 */

const changePopularity = async (userID, valueToModify, increaseValue) => {
    let user = await User.findById(userID, 'popularity');

    if(valueToModify === 'popularity') {
        let popularity = user.popularity;
        if(increaseValue) {
            popularity++;
            await User.findByIdAndUpdate(userID, {'popularity': popularity});
        }
        else {
            popularity--;
            await User.findByIdAndUpdate(userID, {'popularity': popularity});
        }
    }

    else if(valueToModify === 'unpopularity') {
        let unpopularity = user.unpopularity;
        if(increaseValue) {
            unpopularity++;
            await User.findByIdAndUpdate(userID, {'unpopularity': unpopularity});
        }
        else {
            unpopularity--;
            await User.findByIdAndUpdate(userID, {'unpopularity': unpopularity});
        }
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
    getUserProfilePicture
}