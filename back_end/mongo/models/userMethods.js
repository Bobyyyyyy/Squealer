const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const User = require("../schemas/User");
const {saltRounds,quota} = require("./utils");
const {json} = require("express");
const Post = require("../schemas/Post");
const {start} = require("@popperjs/core");
const {scheduledFnOne} = require("../controllers/utils");
const connection = require('../ConnectionSingle');


//POST
const addUser = async (body) => {
    try{
        await connection.get();
        //GET user using email and name
        let findName = await User.find({username: body.name}).lean();

        if (findName.length !== 0) {
            let err = new Error("Utente già registrato!");
            err.statusCode = 400;
            console.log(err);
            
            throw err;
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
        
        console.log(err);
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
        await mongoose.connection.close()
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
        return await User.find({$or : [{username: {$regex: query.filter , $options: 'i'}},{email: {$regex: query.filter , $options: 'i'}},{typeUser: {$regex: query.filter , $options: 'i'}}, ] } ).skip(offset).limit(limit).lean();
    }
    catch (err){
        throw err;
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
 * @return {Promise<void>}
 */
const resetQuota = async (type) => {
    try{
        await connection.get();

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
            updateQuota[key] = percentage* (quota[key]);
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
                  'maxQuota.mohtly': {
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
            }]).lean()

        

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
    updateMaxQuota,
    changePopularity,
}