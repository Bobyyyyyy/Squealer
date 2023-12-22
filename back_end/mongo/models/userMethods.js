const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const Channel = require("../schemas/Channel")
const User = require("../schemas/User");
const {saltRounds,quota, createError} = require("./utils");
const {json} = require("express");
const Post = require("../schemas/Post");
const {start} = require("@popperjs/core");
const {scheduledFnOne} = require("../controllers/utils");
const connection = require('../ConnectionSingle');


//POST
const addUser = async (body) => {
    try{
        await connection.get();
        body.name = body.name.trim();

        if(!isNaN(parseInt(body.name))) {
            throw createError('Nome non valido',400);
        }

        //GET user using email and name
        let findName = await User.findOne({username: body.name}).lean();
        let findChannel = await User.findOne({name: body.name}).lean();
        if (findName || findChannel) {
            throw createError("Nome non disponibile",404);
        }


        let newUser = new User({
            username: body.name,
            password: await bcrypt.hash(body.password,saltRounds),
            typeUser: body.type ? body.type : 'user',
            characters: body.type === 'mod' ? {daily: null, weekly: null, monthly: null} : quota,
            ...(body.type === 'smm') && {vipHandled: []},
            maxQuota: body.type === 'mod' ? {daily: null, weekly: null, monthly: null} : quota,
            popularity: body.type === 'mod' ? null : 0,
            unpopularity: body.type === 'mod' ? null : 0,
        });


        //save new user in DB
        await newUser.save();



        return newUser;
    }
    catch(err){
        throw err;
    }
}

const loginUser = async (query) =>{
    try{
        await connection.get();
        //get user by username
        let user = await User.findOne({username: query.user}).lean();
        //check if user exists
        if (!user){
            let err = new Error("Nessun utente trovato!");
            err.statusCode = 400;       // 400 ??
            console.log(err);

            throw err;
        }

        //check if passwd is right
        const match = await bcrypt.compare(query.password, user.password);

        if (!match){
            let err = new Error("Password Sbagliata!");
            err.statusCode = 400;       // 400 ??
            console.log(err);

            throw err;
        }


        return user;
    }
    catch (err){

        throw err;
    }
}

const updateProfilePicture = async (username, newProfilePic) => {
    try {
        await connection.get();
        let user = await User.findOneAndUpdate({username: username}, {profilePicture: newProfilePic});
        if (!user) {
            throw new Error("utente non trovato");
        }
        return true;
    } catch (err) {
        throw err;
    }
}

/**
 * @param {String} username
 * @param credentials
 * @returns {Promise<void>}
 */
const getUserProfilePicture = async (username) => {
    try {
        await connection.get();
        let user = await User.findOne({username: username}).lean();
        //if (mongoose.connection.base.connections.length === 0) {

        return {profilePic: user.profilePicture};
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//GET
const searchByUsername = async (query) =>{
    try {
        await connection.get();
        let user = await User.findOne({username: query.username}).lean();
        if (!user) {
            let err = new Error("Nessun utente trovato!");
            err.statusCode = 400;       // 400 ??
            console.log(err);

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
const changePwsd = async(body) =>{
    try{
        await connection.get();
        let user = await User.find({email: body.email});    //query o body??

        if (user.length === 0) {
            let err = new Error("Mail inesistente");
            err.statusCode = 400;
            console.log(err);

            return err;
        }
        user.password = await bcrypt.hash(body.password,saltRounds);

        await user.save();
    }
    catch (err) {

        console.log(err);
        throw err;
    }
}

const getUsers = async (query) =>{
    try {
        await connection.get();
        let offset = parseInt(query.offset);
        let limit = parseInt(query.limit);

        query.filter = JSON.parse(query.filter);

        let filter = {
            // filtrare profili per nome
            ...(query.filter.name) && {'username': new RegExp(`^${query.filter.name}`)},
            // filtrare profili per tipo ['public','private']
            ...(query.filter.type) && {'type': query.filter.type},
        }
        return await User.find(filter).skip(offset).limit(limit).lean();
    }
    catch (err){
        throw err;
    }
}

const getSingleUser = async (query) => {
    try {
        await connection.get()
        let findUser = await User.findOne({username: query.name}).lean();
        console.log(findUser);
        if (!findUser) {
            throw createError("l'utente non esiste", 404);
        }
        return findUser;
    } catch (error) {
        throw error;
    }
}

const usersLength = async (query) => {
    try {
        await connection.get();
        let users = await User.find({$or : [{username: {$regex: query.filter , $options: 'i'}},{email: {$regex: query.filter , $options: 'i'}},{typeUser: {$regex: query.filter , $options: 'i'}},]}).lean();

        return {length: users.length};
    }
    catch (Error){
        throw Error;
    }
}

const altUser = async (body) => {
    try {
        await connection.get();
        let user = await User.findOneAndUpdate(
            {username: {$regex: body.filter , $options: 'i'}},
            {blocked: body.blocked,
            'characters.daily':  parseInt(body.characters.daily),
            'characters.weekly':  parseInt(body.characters.weekly),
            'characters.monthly':  parseInt(body.characters.monthly)},
            {new: true}).lean();

        return user;
    }
    catch (Error){
        throw Error;
    }
}

//GET
const getHandledVip = async (query) => {
    try {
        await connection.get();
        let vipHandled = (await User.findOne({username: query.SMMname},'vipHandled')).vipHandled;



        return vipHandled
    }
    catch (Error){
        throw Error;
    }
}

/**
 *
 * @param {String} user
 * @return {Promise<>}
 */
const getUserQuota = async (user) => {
    try {
        await connection.get()
        let quota = await User.findOne({username: user},'characters maxQuota').lean();

        delete quota._id;

        return quota;
    }
    catch (Error){
        throw Error;
    }
}

const get_n_FollnPosts = async(body) => {
    try{
        await connection.get();

        let posts = await Post.find({owner: body.user});



        return {nposts: posts.length};
    }
    catch (err){
        throw err;
    }
}

/**
 *
 * @param {String} type - ['D','W','M']
 * @param {String} user
 * @return {Promise<void>}
 */
const resetQuota = async (type, user = 'ALL_USER') => {
    try{
        await connection.get();
        if (user === 'ALL_USER'){
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
        }
        else{
            let res ;
            switch (type){
                case 'D':
                    res = await User.findOneAndUpdate({username: user},[{$set: {"characters.daily": "$maxQuota.daily"}}], { returnOriginal: false }).lean()
                    break;
                case 'W':
                    res = await User.findOneAndUpdate({username: user},[{$set: {"characters.weekly": "$maxQuota.weekly"}}], { returnOriginal: false }).lean()
                    break;
                case 'M':
                    res = await User.findOneAndUpdate({username: user},[{$set: {"characters.monthly": "$maxQuota.monthly"}}], { returnOriginal: false }).lean()
                    break;
            }
            return res.characters;
        }

    }catch (e) {
        throw(e)
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


/**
 *
 * @param {Number} percentage - {0,...}
 * @param {String} user - username
 * @param {Number} ID - for cron jobs - default -1
 * @return {Promise<void>}
 */
const updateMaxQuota = async (percentage, user, ID = -1) => {
    try{
        let updateQuota = {};
        Object.keys(quota).forEach((key)=> {
            updateQuota[key] = Math.floor((percentage/100) * (quota[key]));
        })

        await connection.get();

        let res = await User.findOneAndUpdate({username:user},
            [{ $set:{
                  'maxQuota.daily': {
                      $trunc:[
                          {
                              $add:[
                                  "$maxQuota.daily",
                                  updateQuota.daily,
                              ]
                          }
                      ]
                  },
                  'maxQuota.weekly': {
                      $trunc:[
                          {
                              $add:[
                                  "$maxQuota.weekly",
                                  updateQuota.weekly,
                              ]
                          }
                      ]
                  },
                  'maxQuota.monthly': {
                      $trunc:[
                          {
                              $add:[
                                  "$maxQuota.monthly",
                                  updateQuota.monthly,
                              ]
                          }
                      ]
                  }
              }
            }], { returnOriginal: false }).lean()



        //called by cron:
        if (ID !== -1) {
            let idx = scheduledFnOne.findIndex(job => job.user === user && job.id ===ID);
            scheduledFnOne[idx].job.stop();
            scheduledFnOne.splice(idx,1);
        }

        return res;
    }catch (e) {
        throw(e);
    }
}


/*      DEPLOY    */

const clearDB = async () => {
    await connection.get();
    await User.deleteMany();
    await require('../schemas/officialChannels').deleteMany();
    await Post.deleteMany();
    await Channel.deleteMany();
    await Notification.deleteMany();


}


module.exports = {
    addUser,
    searchByUsername,
    changePwsd,
    loginUser,
    getUsers,
    getSingleUser,
    usersLength,
    altUser,
    getHandledVip,
    getUserQuota,
    get_n_FollnPosts,
    resetQuota,
    updateMaxQuota,
    changePopularity,
    getUserProfilePicture,
    updateProfilePicture,
    clearDB
}