const {mongoCredentials} = require('../models/utils.js')
const channelsModel = require('../models/ChannelMethods');
const {mongo} = require("mongoose");
const createChannel = async (req,res,next) => {
    try {
        res.send(await channelsModel.addChannel(req.body,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const getChannelList = async (req,res) => {
    try {
        res.send(await channelsModel.channelVipList(req.query,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const checkUserInChannel = async (req,res) => {
    try {
        res.send(await channelsModel.checkUserChannel(req.query,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const getChannels = async (req,res) => {
    try {
        res.send(await channelsModel.getChannels(req.query,mongoCredentials))
    }
    catch (error){
        res.sendStatus(400);
    }
}

const getChannelsNumber = async (req,res) => {
    try {
        res.send(await channelsModel.getChannelsNumber(req.query.filters,mongoCredentials))
    }
    catch (error) {
        res.sendStatus(400);
    }
}

const changeChannelName = async (req,res) => {
    try {
        res.send(await channelsModel.changeChannelName(req.body.channelName,req.body.newName,req.session.user,mongoCredentials));
    }
    catch (error) {
        res.status(400).send(error)
    }
}

const getSingleChannel = async (req,res) => {
    try {
        let name = req.params.name;
        res.send(await channelsModel.getSingleChannel(name,mongoCredentials));
    }
    catch (error) {
        res.sendStatus(400);
    }
}

const blockChannel = async (req,res) => {
    try {
        let user = req.body.user;
        let channel = req.body.channel;

        res.send(await channelsModel.blockChannel(user,channel,mongoCredentials))
    }
    catch (error) {
        res.sendStatus(400);
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
    changeChannelName
}