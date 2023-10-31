const {addPost, getAllPost} = require('../scripts/postMethods');
const {addUser, searchByUsername, changePwsd, getUsers, usersLength, altUser, getHandledVip} = require('../scripts/userMethods');
const {mongoCredentials} = require('../scripts/utils.js')
const {addOfficialChannel, addFollower, addAdmin, deleteChannel, channelsLength, getChannels, searchByChannelName,
    modifyDescription
} = require("../scripts/ReservedChannelMethods");
const {addChannel, channelVipList} = require("../scripts/ChannelMethods");

/* User Methods */
const createUser = async (req,res,next) => {
    try {
        req.response = await addUser(req.body, mongoCredentials);
        next();
    } catch (Error) {
        res.redirect('/register');
    }
}
const searchUser = async (req,res) => {
    res.send(await searchByUsername(req.body,mongoCredentials));
}

const changePassword = async (req,res) => {
    res.send(await changePwsd(req.body,mongoCredentials));
}

const getSessionUser = async (req,res) => {
    res.send({username: req.session.user});
}

const modifyUser = async(req,res) => {
    try{
        res.send(await altUser(req.body,mongoCredentials));
    }
    catch(error) {
        res.send(error);
    }
}

const getAllUsers = async (req,res) => {
    try {
        res.send(await getUsers(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getUsersNumber = async (req,res) => {
    try {
        res.send(await usersLength(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getVips = async (req,res) => {
    try {
        res.send(await getHandledVip(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

/* Post Methods */
const createPost = async (req,res) => {
    res.send(await addPost(req.body,mongoCredentials));
}


/* Reserved Channel Methods */
const createReservedChannel = async (req,res,next) => {
    try {
        req.response = await addOfficialChannel(req.body,mongoCredentials,{name: req.session.user});
        next();
    }
    catch(error) {
        res.send(error);
    }
}

const addAdmins = async (req,res) => {
    try {
        res.send(await addAdmin(req.body,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const deleteCh = async (req,res) => {
    try {
        res.send(await deleteChannel(req.body,mongoCredentials));
    }
    catch(error) {
        res.send(error);
    }
}

const getChannelsNumber = async (req,res) => {
    try {
        res.send(await channelsLength(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getChannel = async (req,res) => {
    try {
        res.send(await getChannels(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

/* Channel Methods */
const createChannel = async (req,res) => {
    try {
        res.send(await addChannel(req.body,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const getChannelList = async (req,res) => {
    try {
        res.send(await channelVipList(req.query,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const getPosts = async (req,res) => {
    try {
        res.send(await getAllPost(req.query,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const channel = async (req,res) => {
    try {
        res.send(await searchByChannelName(req.query,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const modifyDesc = async (req,res) => {
    try {
        res.send(await modifyDescription(req.body,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

module.exports = {
    createUser,
    createPost,
    searchUser,
    changePassword,
    getSessionUser,
    getAllUsers,
    getUsersNumber,
    modifyUser,
    getVips,
    createReservedChannel,
    addAdmins,
    deleteCh,
    getChannelsNumber,
    getChannel,
    createChannel,
    getChannelList,
    getPosts,
    channel,
    modifyDesc
}