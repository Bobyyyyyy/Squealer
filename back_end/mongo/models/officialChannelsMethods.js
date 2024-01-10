const mongoose = require('mongoose');
const ReservedChannel = require("../schemas/officialChannels");
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const connection = require('../ConnectionSingle');
const OfficialChannel = require("../schemas/officialChannels")
const {createError} = require("./utils");
const {create} = require("connect-mongo");
const {removeDestination} = require("./postMethods");
const Channel = require("../schemas/Channel");

//POST
const addOfficialChannel = async (body,creator) => {
    try{
        await connection.get();
        // trasformare il nome in una forma ragionevole
        let name = body.name.toUpperCase();
        name = name.trim();
        name = name.replace('§',"");
        name = name.replace('@',"");
        name = name.replace(/\s/g, "_");
        name = name.replace('/','_');
        if(!isNaN(parseInt(body.name))) {
            throw createError('Nome non valido',400);
        }
        //check if channel exists already
        let findName = await Channel.findOne({name: name}).lean();
        let findUser = await User.findOne({name:name}).lean();
        if (findName || findUser) {
            throw createError('Nome già utilizzato',400)
        }
        let newChannel = new ReservedChannel({
            name: name,
            creator: creator.name,
            description: body.description.trim(),
            silenceable: body.silenceable ? true : false,
            ...(body.profilePicture) && {profilePicture: body.profilePicture},
            silenced : body.silenceable ? [] : null,
        });
        //save new reserved channel in DB
        await newChannel.save();
        return newChannel;
    }
    catch(err){
        throw err;
    }
}

const deleteChannel = async (body) => {
    try{
        await connection.get();
        let findName = await ReservedChannel.findOneAndDelete({name: body.name}).lean();
        if (!findName) {
            throw createError('Nessun canale con questo nome',400);
        }
        let posts = await Post.find({'officialChannelsArray': body.name});

        for (let post of posts) {
            await removeDestination(body.name, post._id);
        }
    }
    catch(err){
        throw err;
    }
}

const getChannels = async (query) =>{
    try {
        await connection.get();
        let offset = parseInt(query.offset);
        let limit = parseInt(query.limit);
        return await ReservedChannel.find({$or : [{name: {$regex: query.filter , $options: 'i'}}]}).skip(offset).limit(limit).lean();
    }
    catch (err){
        throw err;
    }
}

const channelsLength = async (query) => {
    try {
        await connection.get();
        let channels = await ReservedChannel.find({name: {$regex: query.filter , $options: 'i'}}).lean();
        return {length: channels.length};
    }
    catch (Error){
        throw Error;
    }
}

const searchByChannelName = async (query) =>{
    try {
        await connection.get();
        let ChannelName = query.name.trim().toUpperCase();
        let channel = await ReservedChannel.findOne({name: ChannelName}).lean();
        if (!channel) {
            throw createError('Canale non trovato',404);
        }
        return channel;
    }
    catch (err){
        throw err;
    }
}

const modifyDescription = async (body) => {
    try {
        await connection.get();
        let channel = await ReservedChannel.findOneAndUpdate({name: body.channel},
            {description : body.description},{new: true}).lean();
        if (!channel) {
            throw createError('Canale non trovato',404);
        }
        
    }
    catch (err) {
        throw err;
    }
}

const getOfficialChannelProfilePicByName = async (channelName) => {
    try {
        await connection.get();
        let channel = await OfficialChannel.findOne({name: channelName}).lean();
        if (!channel) {
            throw createError('Canale non esiste',400);
        }
        return {profilePicture: channel.profilePicture};

    } catch (err) {
        console.log(err);
        throw err;
    }
}

const updateOfficialChannelProfilePic = async (channelName, newProfilePic) => {
    try {
        await connection.get();
        let channel = await OfficialChannel.findOneAndUpdate({name: channelName}, {profilePicture: newProfilePic});
        if (!channel) {
            throw createError('Canale non esiste',400);
        }
        return true;
    } catch (err) {
        throw err;
    }
}


const updateSilenceUser = async (channelName, username) => {
    try {
        await connection.get();
        let channel = await OfficialChannel.findOne({'name': channelName}).lean();
        let user = await User.findOne({username: username}).lean();

        if (!channel) {
            throw createError('Canale non esiste',400);
        }

        if (!user) {
            throw createError('Utente non esiste',400);
        }

        let checkUser = await OfficialChannel.findOne({$and: [{name: channelName},{'silenced': user.username}]}).lean();

        if (checkUser) {
            await OfficialChannel.findOneAndUpdate({name: channelName},{$pull: {'silenced': user.username}}).lean();
        } else {
            await OfficialChannel.findOneAndUpdate({name: channelName},{$push: {'silenced': user.username}}).lean();
        }

    } catch (err) {
        throw err;
    }
}

//manca un delete per provare le principali API

module.exports = {
    addOfficialChannel,
    deleteChannel,
    getChannels,
    channelsLength,
    searchByChannelName,
    modifyDescription,
    getOfficialChannelProfilePicByName,
    updateOfficialChannelProfilePic,
    updateSilenceUser
}