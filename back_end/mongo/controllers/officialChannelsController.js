const officialChannel = require('../models/officialChannelsMethods');

/* Reserved Channel Methods */
const createReservedChannel = async (req,res,next) => {
    try {
        res.status(200).send(await officialChannel.addOfficialChannel(req.body,{name: req.session.user}))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        res.status(500).send(Error);
    }
}
const deleteCh = async (req,res) => {
    try {
        res.send(await officialChannel.deleteChannel(req.body));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        res.status(500).send(Error);
    }
}

const getChannelsNumber = async (req,res) => {
    try {
        res.send(await officialChannel.channelsLength(req.query));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        res.status(500).send(Error);
    }
}

const getChannel = async (req,res) => {
    try {
        res.send(await officialChannel.getChannels(req.query));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        res.status(500).send(Error);
    }
}

const modifyDesc = async (req,res) => {
    try {
        res.send(await officialChannel.modifyDescription(req.body))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        res.status(500).send(Error);
    }
}

const channel = async (req,res) => {
    try {
        res.send(await officialChannel.searchByChannelName(req.query))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        res.status(500).send(Error);
    }
}


module.exports = {
    createReservedChannel,
    deleteCh,
    getChannelsNumber,
    getChannel,
    modifyDesc,
    channel
}