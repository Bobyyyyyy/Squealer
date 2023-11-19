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


const getSingleChannel = async (req,res) => {
    try {
        let name = req.params.name;
        console.log(name);
        res.send(await channelsModel.getSingleChannel(name,mongoCredentials));
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
    getSingleChannel
}