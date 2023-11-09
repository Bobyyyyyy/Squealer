const {addPost, getAllPost, deletePost, updateReac, deleteReac, getLastPostUser} = require('../scripts/postMethods');
const {addUser, searchByUsername, changePwsd, getUsers, usersLength, altUser, getHandledVip,getUserQuota,get_n_FollnPosts} = require('../scripts/userMethods');
const {mongoCredentials} = require('../scripts/utils.js')
const {addOfficialChannel, deleteChannel, channelsLength, getChannels, searchByChannelName,
    modifyDescription
} = require("../scripts/ReservedChannelMethods");
const {addChannel, channelVipList, checkUserChannel} = require("../scripts/ChannelMethods");

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

const updateSessionVip = async (req,res) => {
    try{
        req.session.vip = req.body.vipName;
        req.session.save();
        res.send({vip: req.session.vip})
    }catch (e) {
        console.log(e)
    }
}
const getSessionVip = async (req,res) => {
    res.send({vip: req.session.vip})
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

const getQuota = async (req,res) => {
    try {
        res.send(await getUserQuota(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getFollnPosts = async(req,res)=> {
    try {
        res.send(await get_n_FollnPosts(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getLastPost = async(req,res)=> {
    try {
        res.send(await getLastPostUser(req.query, mongoCredentials));
    } catch (error) {
        res.send(error);
    }
}

/* Post Methods */
const createPost = async (req,res) => {
    try{

        res.send(await addPost(req.body,mongoCredentials));
    }
    catch (err){
        console.log(err);
        res.send(err)
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

const updateReaction = async (req,res) => {
    try {
        res.send(await updateReac(req.body,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const deleteReaction = async (req,res) => {
    try {
        res.send(await deleteReac(req.body,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
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

const checkUserInChannel = async (req,res) => {
    try {
        res.send(await checkUserChannel(req.query,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}


const removePost = async (req,res) => {
    try {
        let body = {id: req.body.id, name: req.session.user, type: req.session.type}
        res.send(await deletePost(body,mongoCredentials))
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
    deleteCh,
    getChannelsNumber,
    getChannel,
    createChannel,
    getChannelList,
    getPosts,
    channel,
    modifyDesc,
    checkUserInChannel,
    removePost,
    updateReaction,
    deleteReaction,
    getSessionVip,
    updateSessionVip,
    getQuota,
    getFollnPosts,
    getLastPost
}