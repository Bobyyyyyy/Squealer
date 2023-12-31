const channelsModel = require('../models/ChannelMethods');
const {mongo} = require("mongoose");
const createChannel = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.addChannel(req.body))
    } catch (Error) {
        if((typeof Error.statusCode) !== 'undefined') {
            res.status(Error.statusCode).send(Error.message);
        }
        else {
            res.status(500).send(Error);
        }
    }
}

const checkUserInChannel = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.checkUserChannel(req.query))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getChannels = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.getChannels(req.query))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getChannelsNumber = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.getChannelsNumber(req.query.filters))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const changeChannelName = async (req,res) => {
    try {
        res.status(200).send(await channelsModel.changeChannelName(req.body.channelName,req.body.newName,req.session.user));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getSingleChannel = async (req,res) => {
    try {
        let name = req.params.name;
        let user = req.session.type === 'smm' ? req.session.vip : req.session.user;
        res.status(200).send(await channelsModel.getSingleChannel(name,user));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const blockChannel = async (req,res) => {
    try {
        let user = req.session.user;
        let channel = req.body.channel;
        res.status(200).send(await channelsModel.blockChannel(user,channel))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const addFollower = async function (req,res){
    try {
        let user = req.body.user;
        let channel = req.body.channel;
        res.status(200).send(await channelsModel.addFollower(user,channel))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const handleRequest = async function (req,res) {
    try {
        let admin =  req.session.type === 'smm' ? req.session.vip : req.session.user;
        let user = req.body.user
        let channel = req.body.channel;
        let accepted = req.body.accepted;
        res.status(200).send(await channelsModel.handleRequest(admin,user,channel,accepted))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const addAdmin = async function (req,res) {
    try {
        let admin = req.session.type === 'smm' ? req.session.vip : req.session.user;
        let user = req.body.user;
        let channel = req.body.channel;
        res.status(200).send(await channelsModel.addAdmin(user,admin,channel));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const handlePermission = async function (req, res) {
    try {
        let admin = req.session.type === 'smm' ? req.session.vip : req.session.user;
        let user = req.body.user;
        let channel = req.body.channel;
        let canWrite = req.body.canWrite;
        res.status(200).send(await channelsModel.handlePermission(admin,user,channel,canWrite))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getChannelProfilePicByName = async (req,res) => {
    try {
        res.send(await channelsModel.getChannelProfilePicByName(req.query.channelName));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const updateChannelProfilePic = async (req, res) => {
    try {
        res.send(await channelsModel.updateChannelProfilePic(req.body.channelName, req.body.newProfilePic));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

module.exports = {
    createChannel,
    checkUserInChannel,
    getChannels,
    getChannelsNumber,
    getSingleChannel,
    blockChannel,
    changeChannelName,
    addFollower,
    handleRequest,
    handlePermission,
    addAdmin,
    getChannelProfilePicByName,
    updateChannelProfilePic
}