const channelsModel = require('../models/ChannelMethods');
const {mongo} = require("mongoose");
const createChannel = async (req,res,next) => {
    try {
        res.send(await channelsModel.addChannel(req.body))
    }
    catch(error) {
        res.send(error);
    }
}

const getChannelList = async (req,res) => {
    try {
        res.send(await channelsModel.channelVipList(req.query))
    }
    catch(error) {
        res.send(error);
    }
}

const checkUserInChannel = async (req,res) => {
    try {
        res.send(await channelsModel.checkUserChannel(req.query))
    }
    catch(error) {
        res.send(error);
    }
}

const getChannels = async (req,res) => {
    try {
        res.send(await channelsModel.getChannels(req.query))
    }
    catch (error){
        res.sendStatus(400);
    }
}

const getChannelsNumber = async (req,res) => {
    try {
        res.send(await channelsModel.getChannelsNumber(req.query.filters))
    }
    catch (error) {
        res.sendStatus(400);
    }
}


const getSingleChannel = async (req,res) => {
    try {
        let name = req.params.name;
        res.send(await channelsModel.getSingleChannel(name));
    }
    catch (error) {
        res.sendStatus(400);
    }
}

const blockChannel = async (req,res) => {
    try {
        let user = req.body.user;
        let channel = req.body.channel;

        res.send(await channelsModel.blockChannel(user,channel))
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
    blockChannel
}