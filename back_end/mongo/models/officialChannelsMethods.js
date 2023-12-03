const mongoose = require('mongoose');
const ReservedChannel = require("../schemas/officialChannels");
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const connection = require('../ConnectionSingle');


//POST
const addOfficialChannel = async (body,creator) => {
    try{
        await connection.get();
        // trasformare il nome in una forma ragionevole
        let name = body.name.toUpperCase();
        name = name.trim();
        name = name.replace(/\s/g, "_");
        name = name.replace('/','_');
        //check if channel exists already
        let findName = await ReservedChannel.findOne({name: name}).lean();
        if (findName) {
            let err = new Error("Canale Già esistente");
            err.statusCode = 400;
            console.log(err);
            
            throw err;
        }
        let newChannel = new ReservedChannel({
            name: name,
            creator: creator.name,
            description: body.description,
        });
        //save new reserved channel in DB
        await newChannel.save();
        
        return newChannel;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const deleteChannel = async (body) => {
    try{
        await connection.get();
        let findName = await ReservedChannel.findOneAndDelete({name: body.name}).lean();
        if (!findName) {
            let err = new Error("Nessun Canale Con questo nome");
            err.statusCode = 400;
            throw err;
        }
        await Post.deleteMany({'officialChannelsArray': body.name});
        
    }
    catch(err){
        console.log(err);
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

const searchByChannelName = async (query, credentials) =>{
    try {
        await connection.get();
        let ChannelName = query.name.trim().toUpperCase();
        let channel = await ReservedChannel.findOne({name: ChannelName}).lean();
        if (!channel) {
            let err = new Error("Nessun canale trovato!");
            err.statusCode = 400;       // 400 ??;
            throw err;
        }
        return channel;
    }
    catch (err){
        throw err;
    }
}

const modifyDescription = async (body, credentials) => {
    try {
        await connection.get();
        let channel = await ReservedChannel.findOneAndUpdate({name: body.channel},
            {description : body.description},{new: true}).lean();

        if (!channel) {
            let err = new Error("Nessun canale trovato!");
            err.statusCode = 400;       // 400 ??
            throw err;
        }
        
    }
    catch (err) {
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
    modifyDescription
}