const {connectdb, createError} = require("./utils");
const Channel = require("../schemas/Channel");
const User = require("../schemas/User");
const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");
const {create} = require("connect-mongo");

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

const addChannel = async (body,credentials) => {
    try{
        await connectdb(credentials);
        // trasformare il nome in una forma ragionevole
        let name = body.name.toLowerCase();
        name = name.trim();
        name = name.replace(/\s/g, "_");
        name = name.replace('/','_');
        //check if channel exists already
        let findName = await Channel.findOne({name: name}).lean();
        if (findName) {
            let err = new Error("Canale Già esistente");
            err.statusCode = 400;
            err.message = "Canale Già esistente";
            console.log(err);
            await mongoose.connection.close();
            throw err;
        }

        let user = await User.findOne({username: body.creator});
        if (!user) {
            let err = new Error("Utente non esiste");
            err.statusCode = 400;
            err.message = "Utente non esiste";
            await mongoose.connection.close();
            throw err;
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
        await mongoose.connection.close();
        return newChannel;
    }
    catch(err){
        await mongoose.connection.close();
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

/**
 * @param query
 * @param credentials
 * Returns list of channels filtered by the query
 * */
const getChannels = async (query,credentials) => {
        await connectdb(credentials);
        let offset = parseInt(query.offset);
        let limit = parseInt(query.limit);

        let sort = sorts["Populars"];

        query.filters = query.filters ? JSON.parse(query.filters) : {};

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

        console.log(channels);
        return channels;
}


const getChannelsNumber = async (filters,credentials) => {
    try {
        await connectdb(credentials);
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

        await mongoose.connection.close();
        return {length: channels.length};
    }
    catch (Error){
        throw Error;
    }
}


const getSingleChannel = async(name,credentials) => {
    try{
        await connectdb(credentials);
        let ChannelName = name.trim().toLowerCase();
        let channel = await Channel.findOne({name: ChannelName}).lean();
        if (!channel) {
            let err = new Error("Nessun canale trovato!");
            err.statusCode = 400;       // 400 ??;
            await mongoose.connection.close();
            throw err;
        }
        return channel;
    }
    catch (error) {
        throw error;
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

    } catch (e) {
        await mongoose.connection.close();
        console.log(e)
    }
}


const blockChannel = async (user,channelName,credentials) => {
    try {
        await connectdb(credentials);

        let name = await User.findOne({username: user});

        console.log(name);
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
    blockChannel
}