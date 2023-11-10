const {connectdb} = require("./utils");
const Channel = require("../schemas/Channel");
const User = require("../schemas/User");
const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");

const addChannel = async (body,credentials) => {
    try{
        await connectdb(credentials);
        //check if channel exists already
        let findName = await Channel.findOne({name: body.name}).lean();
        if (findName) {
            let err = new Error("Canale Già esistente");
            err.statusCode = 400;
            err.message = "Canale Già esistente";
            console.log(err);
            await mongoose.connection.close();
            throw err;
        }
        const newChannel = new Channel({
            name: body.name,
            description: body.description,
            isPublic: body.isPublic,
            posts: [],
            creator: body.creator,
            admins: [],
            followers: []
        })
        //save new channel in DB
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

const channelVipList = async (query,credentials) => {
    try{
        await connectdb(credentials);
        let channels = await Channel.find({ $or: [{ creator: query.vipName },{admins: {$in: [query.vipName] }}]})
        await mongoose.connection.close();
        return channels;
    }catch (e) {
        await mongoose.connection.close();
        console.log(e)
    }
}

const checkUserChannel = async (query,credentials) => {
    try{
        await connectdb(credentials);

        let channel = await Channel.findOne({name:query.channel, $or:[
            {creator:query.user},
            {admins: {$in: [query.user]}},
            {followers:{$in:[{user:query.user}]}}
        ]});

        let userInChannel='';

        if (!channel) userInChannel="noEntry";
        else{
            if (channel.creator === query.user) userInChannel = 'creator';
            else if (channel.admins.find(el => el === query.user)) userInChannel = 'admin';
            else if (channel.followers.find(el => el.user === query.user)) userInChannel = 'follower';
        }

        await mongoose.connection.close();

        return {canAccessAs: userInChannel}

    }catch (e) {
        await mongoose.connection.close();
        console.log(e)
    }
}

module.exports = {
    addChannel,
    channelVipList,
    checkUserChannel
}