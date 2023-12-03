const {connectdb, createError} = require("./utils");
const Channel = require("../schemas/Channel");
const User = require("../schemas/User");
const Post = require("../schemas/Post");
const mongoose = require("mongoose");
const connection = require('../ConnectionSingle');
const {ObjectId} = require("mongodb");
const {create} = require("connect-mongo");
const {channel} = require("../controllers/officialChannelsController");

const sorts = {
    'Populars': {
        followerNumber : -1
    },
    'Unpopulars': {
        followerNumber: 1,
    },

    'PostNumberDesc': {
        postNumber: -1,
    },

    'PostNumberAsc': {
        postNumber: 1,
    }
}

const addChannel = async (body) => {
    try{
        await connection.get()
        // trasformare il nome in una forma ragionevole
        let name = body.name.toLowerCase();
        name = name.trim();
        name = name.replace(/\s/g, "_");
        name = name.replace('/','_');
        //check if channel exists already
        let findName = await Channel.findOne({name: name}).lean();
        let findUser = await User.findOne({name:name}).lean();
        if (findName || findUser) {
            throw createError('Nome non utilizzabile',400)
        }

        let user = await User.findOne({username: body.creator});
        if (!user) {
            throw createError('Utente non esistente',400);
        }

        const newChannel = new Channel({
            name: name,
            description: body.description,
            type: body.type,
            posts: [],
            creator: body.creator,
            admins: [],
            followers: []
        })

        //save new channel in DB
        await newChannel.save();

        return newChannel;
    }
    catch(err){
        await mongoose.connection.close();
        throw err;
    }
}

const channelVipList = async (query) => {
    try{
        await connection.get()
        return await Channel.find({ $or: [{ creator: query.vipName },{admins: {$in: [query.vipName] }}]});
    }catch (e) {
        throw(e);
    }
}

/**
 * @param query
 * Returns list of channels filtered by the query
 * */
const getChannels = async (query) => {
        await connection.get()
        let offset = parseInt(query.offset);
        let limit = parseInt(query.limit);
        let sort = sorts["Populars"];

        query.filters = JSON.parse(query.filters);

        let filter = {
                //filtrare canale per nome
                ...(query.filters.name) && {'name': {$regex: query.filters.name, $options: 'i'}},
                //filtrare canali per tipo ['public','private']
                ...(query.filters.type) && {'type': query.filters.type},
                //filtrare canale per nome
                ...(query.filters.creator) && {'creator': {$regex: query.filters.creator, $options: 'i'}},

                ...(query.filters.hasAccess) && {$or: [{'name': query.filters.hasAccess},{'admins': {$in: [query.filters.hasAccess]}},{'followers': {$in: [query.filters.hasAccess]}}]}
        }

        if (query.filters.sortBy) {
            if(query.filters.sortBy === 'popularity') {
                if(query.filters.sort === 'popular') {
                    sort = sorts["Populars"];
                }
                else if(query.filters.sort === 'unpopular') {
                    sort = sorts["Unpopulars"];
                }
            }
            else if(query.filters.sortBy === 'posts') {
                if(query.filters.sort === 'ascending') {
                    sort = sorts["PostNumberAsc"];
                }
                else if(query.filters.sort === 'descending') {
                    sort = sorts["PostNumberDesc"];
                }
            }
        }


        let channels = await Channel.find(filter).skip(offset).limit(limit).sort(sort).lean();
        return channels;
}

const changeChannelName = async (channelName,newName,username) => {
    try {
        await connection.get()
        let channel;
        newName = newName.toLowerCase().trim();

        let checkName = await Channel.findOne({name: newName}).lean();
        let checkUser = await User.findOne({'username': newName}).lean();

        if (checkName || checkUser) {
            throw createError('Nome gia utilizzato',400);
        }

        let user = await User.findOne({'username': username}).lean();
        if(user.typeUser === 'mod') {
            channel = await Channel.findOneAndUpdate({name: channelName},{name: newName}).lean();
        }
        else {
            channel = await Channel.findOneAndUpdate({$and: [{name: channelName},{$or: [{'admins': {$in: [username]}},{'creator': username}]}]},{name: newName}).lean();
        }

        if (!channel) {
            throw createError('Canale non esiste o permessi non necessari per modificare nome',400);
        }

        await Post.updateMany({'destinationArray.name': channelName},{$push : {'destinationArray': {destType: 'channel',name: newName}}});
        await Post.updateMany({'destinationArray.name': channelName},{$pull: {'destinationArray': {destType: 'channel', name:channelName}}});

    }
    catch (error) {
        console.log(error);
        throw error
    }
}

const getChannelsNumber = async (filters) => {
    try {
        await connection.get()
        let filter = {
            //filtrare canale per nome
            ...(filters.name) && {'name': filters.name},
            //filtrare canali per tipo ['public','private']
            ...(filters.type) && {'type': filters.type},
            //filtrare canale per nome
            ...(filters.creator) && {'creator': filters.creator},

            ...(filters.filter) && {'name': {$regex: filters.filter, $options: 'i'}},

            ...(filters.hasAccess) && {$or: [{'name': filters.hasAccess},{'admins': {$in: [filters.hasAccess]}},{'followers': {$in: [filters.hasAccess]}}]}
        }

        let channels = await Channel.find(filter).lean();


        return {length: channels.length};
    }
    catch (Error){
        throw Error;
    }
}


const getSingleChannel = async(name) => {
    try{
        await connection.get()
        let ChannelName = name.trim().toLowerCase();
        let channel = await Channel.findOne({name: ChannelName}).lean();
        if (!channel) {
            let err = new Error("Nessun canale trovato!");
            err.statusCode = 400;       // 400 ??;
            throw err;
        }
        return channel;
    }
    catch (error) {
        throw error;
    }

}



const checkUserChannel = async (query) => {
    try{
        await connection.get()

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
        return {canAccessAs: userInChannel}

    } catch (e) {
        throw e;
    }
}


const blockChannel = async (user,channelName) => {
    try {
        await connection.get();

        let name = await User.findOne({username: user});

        if(!name || name.typeUser !== 'mod') {
            throw createError('User not found or not moderator',400)
        }

        let channel = await Channel.findOneAndUpdate({name: channelName}, [{$set: {isBlocked: {$not: '$isBlocked'}}}]);

        if(!channel) {
            throw createError('Channel not found',400);
        }

        return true;
    }

    catch (error) {
        throw error;
    }
}



module.exports = {
    addChannel,
    channelVipList,
    checkUserChannel,
    getChannels,
    getChannelsNumber,
    getSingleChannel,
    blockChannel,
    changeChannelName
}