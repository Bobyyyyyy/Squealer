const {connectdb, createError} = require("./utils");
const Channel = require("../schemas/Channel");
const User = require("../schemas/User");
const Post = require("../schemas/Post");
const mongoose = require("mongoose");
const connection = require('../ConnectionSingle');
const {ObjectId} = require("mongodb");
const {create} = require("connect-mongo");
let {channel} = require("../controllers/officialChannelsController");

const channelRoles = {
    '0': 'Creator',
    '1': 'Admin',
    '2': 'Not Follower',
    '3': 'Writer',
    '4': 'Pending',
    '5': 'Follower'
}


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
            followers: [],
            requests: body.type === 'private' ? [] : null,
        })

        //save new channel in DB
        await newChannel.save();

        return newChannel;
    }
    catch(err){
        throw err;
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

        query.filters = query.filters ? JSON.parse(query.filters) : {};

        let filter = {
                //filtrare canale per nome
                ...(query.filters.name) && {'name': {$regex: query.filters.name, $options: 'i'}},
                //filtrare canali per tipo ['public','private']
                ...(query.filters.type) && {'type': query.filters.type},

                ...(query.filters.both) && {
                        $or : [{'creator': query.filters.creator}, {'admins': {$in:[query.filters.hasAccess]}}]
                    },

                ...(!query.filters.both && query.filters.creator) && {'creator': {$regex: query.filters.creator, $options: 'i'}},

                ...(!query.filters.both && query.filters.hasAccess) && {'admins': {$in: [query.filters.hasAccess]}}
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


        let channels = await Channel.aggregate([
            {$match: filter},
            {$sort: sort},
            {$skip: offset},
            {$limit: limit}
        ])


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
            ...(filters.name) && {'name': {$regex: filters.name, $options: 'i'}},
            //filtrare canali per tipo ['public','private']
            ...(filters.type) && {'type': filters.type},
            //filtrare canale per nome
            ...(filters.creator) && {'creator': {$regex: filters.creator, $options: 'i'}},

            ...(filters.hasAccess) && {$or: [{'name': filters.hasAccess},{'admins': {$in: [filters.hasAccess]}},{'followers': {$in: [filters.hasAccess]}}]}
        }

        let channels = await Channel.find(filter).lean();

        return {length: channels.length};
    }
    catch (Error){
        throw Error;
    }
}

/**
 * @param userName
 * @param channelName
 * @returns {Promise<void>}
 * Se il canale e' privato crea una richiesta di follow, se e' pubblico aggiunge il follower
 */
const addFollower = async function (userName, channelName) {
    try {
        await connection.get();
        channelName = channelName.trim().toLowerCase();

        let channel = await Channel.findOne({name: channelName}).lean();
        let user = await User.findOne({username: userName}).lean();

        let checkFollow = await Channel.findOne({name: channelName, 'followers.user': userName});
        if(checkFollow) {
            await Channel.findOneAndUpdate({name: channelName}, {$pull: {'followers': {'user': userName}}});
            return;
        }

        if (channel.type === 'public') {
            // se sei gia' follower lo toglie
            await Channel.findByIdAndUpdate(channel._id,{$push: {'followers': {user: user.username, canWrite: true}}});
        }
        else {
            let checkRequest = await Channel.findOne({name: channelName, 'requests.user': userName});
            if(checkRequest) {
                await Channel.findOneAndUpdate({name: channelName}, {$pull: {'requests': {'user': userName}}});
                return;
            }

            await Channel.findByIdAndUpdate(channel._id,{$push: {'requests': {user: user.username}}});
        }
    }
    catch (error) {
        throw error
    }
}

/**
 * @param username
 * @param adminname
 * @param channelName
 * @returns {Promise<void>}
 * Aggiunge admin in un canale
 */
const addAdmin = async function (username, adminName, channelName) {
    try {
        await connection.get();
        channelName = channelName.trim().toLowerCase();
        let creator = await User.findOne({username: adminName}).lean();
        let user = await User.findOne({username: username}).lean();
        if (!user || !creator) {
            throw createError(`${username} non esiste`,500);
        }
        let channel;

        let checkAdmin = await Channel.findOne({$and: [{name: channelName},{'admins': user.username}]}).lean();
        if (checkAdmin) {
            if(creator.typeUser !== 'mod') {
                channel = await Channel.findOneAndUpdate({$and: [{name: channelName},{'creator': creator.username}]},{$pull: {'admins': username}}).lean();
                await Channel.findOneAndUpdate({name: channelName},{$push: {'followers': {user: username,canWrite:true}}}).lean();
            }
            else {
                channel = await Channel.findOneAndUpdate({name: channelName},{$pull: {'admins': username}}).lean();
                await Channel.findOneAndUpdate({name: channelName},{$push: {'followers': {user: username,canWrite:true}}}).lean();
            }
        }
        else {
            if(creator.typeUser !== 'mod') {
                channel = await Channel.findOneAndUpdate({$and: [{name: channelName},{'creator': creator.username}]},{$push: {'admins': username}}).lean();
                await Channel.findOneAndUpdate({name: channelName},{$pull: {'followers': {user: username}}}).lean();
            }
            else {
                channel = await Channel.findOneAndUpdate({name: channelName},{$push: {'admins': username}}).lean();
                await Channel.findOneAndUpdate({name: channelName},{$pull: {'followers': {user: username}}}).lean();
            }
        }

        if(!channel)
            throw createError(`${admin.username} non ha i permessi necessari`,500);

    }
    catch (error) {
        throw error;
    }
}


/**
 * @param adminName
 * @param userRequest
 * @param channelName
 * @param accepted
 * @returns {Promise<void>}
 * Accetta o rifiuta la richiesta di un utente per un canale privato
 */
const handleRequest = async function(adminName,userRequest,channelName,accepted) {
    try {
        await connection.get();
        channelName = channelName.trim().toLowerCase();
        let admin = await User.findOne({username: adminName}).lean();
        let channel = await Channel.findOne({$and: [{name: channelName},{$or: [{'admins': adminName},{'creator': adminName}]}]}).lean();
        if(!channel)
            throw createError(`${admin.username} non ha i permessi necessari`,500);

        let request = await Channel.findOne({$and: [{name: channelName}, {'requests.user': userRequest}]});
        if (!request)
            throw createError(`Non c'e' nessuna richiesta dell'utente ${userRequest}`,500);

        if (accepted) {
            await Channel.findOneAndUpdate({name: channelName}, {$push: {'followers': {'user': userRequest, 'canWrite':true}}});
        }

        await Channel.findOneAndUpdate({name: channelName}, {$pull: {'requests': {'user': userRequest}}});
    }
    catch (error) {
        throw error
    }
}

const handlePermission = async function(adminName, userRequest, channelName, canWrite) {
    try {
        await connection.get();
        channelName = channelName.trim().toLowerCase();

        let channel = await Channel.findOne({$and: [{name: channelName},{$or: [{'admins': adminName},{'creator': adminName}]}]}).lean();
        if(!channel)
            throw createError(`${adminName.username} non ha i permessi necessari`,400);

        await Channel.findOneAndUpdate({name: channelName, 'followers.user':userRequest}, {$set: {'followers.$.canWrite': canWrite}});
    }
    catch (error) {
        throw error
    }
}

const getSingleChannel = async(name,user) => {
    try{
        await connection.get()
        let channelName = name.trim().toLowerCase();
        let channel = await Channel.findOne({name: channelName}).lean();

        if (!channel) {
            throw createError('Canale Non trovato',404);
        }

        let findUser = await User.findOne({username: user}).lean();
        let userRole;

        let isCreator = channel.creator === findUser.username
        if(isCreator)
            userRole = 0;
        else  {
            let isAdmin = channel.admins.filter((admin) => admin === findUser.username);
            if(isAdmin.length !== 0)
                userRole = 1;
            else {
                let isFollower = channel.followers.filter((follower) => {return follower.user === findUser.username});
                if(await Channel.findOne({name: channelName, 'requests.user': user})) {
                    userRole = 4;
                }
                else if(isFollower.length === 0)
                    userRole = 2;
                else if (isFollower[0].canWrite)
                    userRole = 3;
                else {
                    userRole = 5;
                }
            }
        }

        channel.role = channelRoles[userRole];
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
    checkUserChannel,
    getChannels,
    getChannelsNumber,
    getSingleChannel,
    blockChannel,
    changeChannelName,
    addFollower,
    handleRequest,
    addAdmin,
    handlePermission
}