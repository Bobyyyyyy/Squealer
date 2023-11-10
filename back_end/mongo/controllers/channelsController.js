const {mongoCredentials} = require('../models/utils.js')
const channelsModel = require('../models/ChannelMethods');
const createChannel = async (req,res) => {
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



module.exports = {
    createChannel,
    getChannelList,
    checkUserInChannel,
}