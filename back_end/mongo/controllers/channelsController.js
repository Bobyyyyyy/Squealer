const channelsModel = require('../models/ChannelMethods');
const {mongo} = require("mongoose");
const createChannel = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.addChannel(req.body))
    }
    catch(error) {
        res.status(error.statusCode).send(error.message);
    }
}

const getChannelList = async (req,res) => {
    try {
        res.send(await channelsModel.channelVipList(req.query))
    }
    catch(error) {
        res.status(error.statusCode).send(error.message);
    }
}

const checkUserInChannel = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.checkUserChannel(req.query))
    }
    catch(error) {
        res.status(error.statusCode).send(error.message);
    }
}

const getChannels = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.getChannels(req.query))
    }
    catch (error){
        if(typeof error.statusCode === "undefined")
            res.status(400).send(error);

        console.log(error)
        res.status(error.statusCode).send(error.message);
    }
}

const getChannelsNumber = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.getChannelsNumber(req.query.filters))
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode).send(error.message);
    }
}

const changeChannelName = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.changeChannelName(req.body.channelName,req.body.newName,req.session.user));
    }
    catch (error) {
        res.status(error.statusCode).send(error.message);
    }
}

const getSingleChannel = async (req,res) => {
    try {
        let name = req.params.name;
        res.status(200).send(await channelsModel.getSingleChannel(name,req.session.user));
    }
    catch (error) {
        res.status(error.statusCode).send(error.message);
    }
}

const blockChannel = async (req,res) => {
    try {
        let user = req.session.user;
        let channel = req.body.channel;
        res.status(200).send(await channelsModel.blockChannel(user,channel))
    }
    catch (error) {
        res.status(error.statusCode).send(error.message);
    }
}

const addFollower = async function (req,res){
    try {
        let user = req.body.user;
        let channel = req.body.channel;
        res.status(200).send(await channelsModel.addFollower(user,channel))
    }
    catch (error) {
        res.status(error.statusCode).send(error.message);
    }
}

const handleRequest = async function (req,res) {
    try {
        let admin = req.session.user;
        let user = req.body.user
        let channel = req.body.channel;
        let accepted = req.body.accepted;
        res.status(200).send(await channelsModel.handleRequest(admin,user,channel,accepted))
    }
    catch (error) {
        res.status(error.statusCode).send(error.message);
    }
}

const addAdmin = async function (req,res) {
    try {
        let admin = req.session.user;
        let user = req.body.user
        let channel = req.body.channel;
        res.status(200).send(await channelsModel.addAdmin(user,admin,channel));
    }
    catch (error) {
        console.log(error)
        res.status(error.statusCode).send(error.message);
    }
}

const handlePermission = async function (req, res) {
    try {
        let admin = req.session.user;
        let user = req.body.user;
        let channel = req.body.channel;
        let canWrite = req.body.canWrite;
        res.status(200).send(await channelsModel.handlePermission(admin,user,channel,canWrite))
    }
    catch (error) {
        res.status(error.statusCode).send(error.message);
    }
}

module.exports = {
    createChannel,
    getChannelList,
    checkUserInChannel,
    getChannels,
    getChannelsNumber,
    getSingleChannel,
    blockChannel,
    changeChannelName,
    addFollower,
    handleRequest,
    handlePermission,
    addAdmin
}