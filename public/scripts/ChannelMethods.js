const {connectdb} = require("./utils");
const Channel = require("../models/Channel");
const User = require("../models/User");
const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");

const addChannel = async (body,credentials) => {
    try{
        await connectdb(credentials);
        console.log(body);
        //check if channel exists already
        let findName = await Channel.findOne({name: body.name}).lean();
        if (findName) {
            let err = new Error("Canale Già esistente");
            err.statusCode = 400;
            console.log(err);
            await mongoose.connection.close();
            throw err;
        }
        const newChannel = new Channel({
            name: body.name,
            description: body.description,
            isPublic: body.isPublic,
            posts: [],
            creator: new ObjectId(await User.findOne({username: body.creator},'_id')).toString(),
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
        let vipId = new ObjectId(await User.findOne({username: query.vipName},'_id')).toString();
        let channels = await Channel.find({ $or: [{ creator: vipId },{admins: {$in: [vipId] }}]})
        await mongoose.connection.close();
        return channels;
    }catch (e) {
        await mongoose.connection.close();
        console.log(e)
    }
}

module.exports = {
    addChannel,
    channelVipList
}