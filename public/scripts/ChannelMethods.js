const mongoose = require('mongoose');
const ReservedChannel = require("../models/ReservedChannel");
const {connectdb} = require("./utils");
const {searchByUsername} = require("./userMethods");


//POST
const addOfficialChannel = async (body,credentials) => {
    try{
        console.log(body);
        await connectdb(credentials);
        //check if channel exists already
        let name = '§' + body.name.toUpperCase();
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
            postList: {posts: [] },
            followers: {users: []},
            administrators: {users: []},
        });
        //save new user in DB
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


const addFollower = async (body, credentials) => {
    console.log(body);
    //controlla se l'utente è presente nel database
    let user = await searchByUsername(body,credentials);
    let id = user._id.toString();
    console.log(id);
    //controllo se l'utente è già presente nel canale
    let isInChannel = await ReservedChannel.findOne({$and: [{name: body.channel},{'followers.users': {$elemMatch: {$eq: id}}}]} );
    if(isInChannel) {
        let err = new Error("Utente già follower");
        err.statusCode = 400;       // 400 ??
        console.log(err);
        throw err;
    }
    else {
        //aggiunta nel canale
        let channel = await ReservedChannel.findOneAndUpdate({name: body.channel},
            {$push: {'followers.users': id}, new: true}).lean();
        if (!channel) {
            let err = new Error("Nessun canale trovato!");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            throw err;
        }
        return channel
    }
}

const addAdmin = async (body, credentials) => {
    console.log(body);
    //controlla se l'utente è presente nel database
    let user = await searchByUsername(body,credentials);
    let id = user._id.toString();
    //controllo se utente è moderatore
    if(user.typeUser === 'mod') {
        console.log(id);
        //controllo se l'utente è già presente nel canale
        let isInChannel = await ReservedChannel.findOne({$and: [{name: body.channel}, {'administrators.users': {$elemMatch: {$eq: id}}}]});
        if (isInChannel) {
            let err = new Error("Utente già amministratore");
            err.statusCode = 400;       // 400 ??
            console.log(err);
            throw err;
        } else {
            //aggiunta nel canale
            let channel = await ReservedChannel.findOneAndUpdate({name: body.channel},
                {$push: {'administrators.users': id}, new: true}).lean();
            if (!channel) {
                let err = new Error("Nessun canale trovato!");
                err.statusCode = 400;       // 400 ??
                console.log(err);
                throw err;
            }
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


//manca un delete per provare le principali API

module.exports = {
    addOfficialChannel,
    addFollower,
    addAdmin
}