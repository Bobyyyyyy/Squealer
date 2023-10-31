const mongoose = require('mongoose');
const ReservedChannel = require("../models/ReservedChannel");
const {connectdb} = require("./utils");
const {searchByUsername} = require("./userMethods");
const User = require("../models/User");


//POST
const addOfficialChannel = async (body,credentials,creator) => {
    try{
        await connectdb(credentials);
        // trasformare il nome in una forma ragionevole
        let name = body.name.toUpperCase();
        name = name.replace(/\s/g, "_");
        name = name.replace('/','_');
        //check if channel exists already
        let findName = await ReservedChannel.findOne({name: name}).lean();
        if (findName) {
            let err = new Error("Canale Già esistente");
            err.statusCode = 400;
            console.log(err);
            await mongoose.connection.close();
            throw err;
        }
        let newChannel = new ReservedChannel({
            name: name,
            creator: creator.name,
            postList: {posts: []},
            description: body.description,
            administrators: {users: []},
        });
        //save new reserved channel in DB
        await newChannel.save();
        await mongoose.connection.close();
        return newChannel;
    }
    catch(err){
        await mongoose.connection.close();
        console.log(err);
        throw err;
    }
}


/*const addFollower = async (body, credentials) => {
    await connectdb(credentials);
    //controlla se l'utente è presente nel database
    let user = await searchByUsername(body,credentials);
    //controllo se l'utente è già presente nel canale
    let isInChannel = await ReservedChannel.findOne({$and: [{name: body.channel},{'followers.users': {$elemMatch: {$eq: user.username}}}]} );
    if(isInChannel) {
        let err = new Error("Utente già follower");
        err.statusCode = 400;       // 400 ??
        console.log(err);
        throw err;
    }
    else {
        //aggiunta nel canale
        let channel = await ReservedChannel.findOneAndUpdate({name: body.channel},
            {$push: {'followers.users': user.username}, new: true}).lean();
        if (!channel) {
            let err = new Error("Nessun canale trovato!");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            throw err;
        }
        await mongoose.connection.close();
        return channel
    }
}
*/
const addAdmin = async (body, credentials) => {
    await connectdb(credentials);
    //controlla se l'utente è presente nel database
    let user = await searchByUsername(body,credentials);
    //controllo se utente è moderatore
    if(user.typeUser === 'mod') {
        //controllo se l'utente è già presente nel canale
        let isInChannel = await ReservedChannel.findOne({$and: [{name: body.channel}, {'administrators.users': {$elemMatch: {$eq: user.username}}}]});
        if (isInChannel) {
            let err = new Error("Utente già amministratore");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            throw err;
        } else {
            //aggiunta nel canale
            let channel = await ReservedChannel.findOneAndUpdate({name: body.channel},
                {$push: {'administrators.users': user.username}, new: true}).lean();
            if (!channel) {
                let err = new Error("Nessun canale trovato!");
                err.statusCode = 400;       // 400 ??
                throw err;
            }
            await mongoose.connection.close();
            return channel
        }
    }
    else {
        let err = new Error("Utente non moderatore");
        err.statusCode = 400;       // 400 ??
        console.log(err);
        throw err;
    }
}

const deleteChannel = async (body,credentials) => {
    try{
        await connectdb(credentials);
        let findName = await ReservedChannel.findOneAndDelete({name: body.name}).lean();
        if (!findName) {
            let err = new Error("Nessun Canale Con questo nome");
            err.statusCode = 400;
            throw err;
        }
        await mongoose.connection.close();
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const getChannels = async (query,credentials) =>{
    try {
        await connectdb(credentials);
        let offset = parseInt(query.offset);
        let limit = parseInt(query.limit);
        return await ReservedChannel.find({$or : [{name: {$regex: query.filter , $options: 'i'}}]}).skip(offset).limit(limit).lean();
    }
    catch (err){
        throw err;
    }
}

const channelsLength = async (query,credentials) => {
    try {
        await connectdb(credentials);
        let channels = await ReservedChannel.find({name: {$regex: query.filter , $options: 'i'}}).lean();
        await mongoose.connection.close();
        return {length: channels.length};
    }
    catch (Error){
        throw Error;
    }
}

const searchByChannelName = async (query, credentials) =>{
    try {
        await connectdb(credentials);
        let ChannelName = query.name.toUpperCase();
        let channel = await ReservedChannel.findOne({name: ChannelName}).lean();
        if (!channel) {
            let err = new Error("Nessun canale trovato!");
            err.statusCode = 400;       // 400 ??;
            await mongoose.connection.close();
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
        await connectdb(credentials);
        console.log(body);
        let channel = await ReservedChannel.findOneAndUpdate({name: body.channel},
            {description : body.description},{new: true}).lean();

        if (!channel) {
            let err = new Error("Nessun canale trovato!");
            err.statusCode = 400;       // 400 ??
            throw err;
        }
        await mongoose.connection.close();
    }

    catch (err) {
        throw err;
    }
}


//manca un delete per provare le principali API

module.exports = {
    addOfficialChannel,
    addAdmin,
    deleteChannel,
    getChannels,
    channelsLength,
    searchByChannelName,
    modifyDescription
}