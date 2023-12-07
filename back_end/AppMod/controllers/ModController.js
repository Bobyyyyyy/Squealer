const {searchByChannelName} = require("../../mongo/models/officialChannelsMethods");
const {getSingleChannel} = require("../../mongo/models/ChannelMethods");
const {mongoCredentials} = require("../../mongo/models/utils");
const {mongo} = require("mongoose");

const homepageView = (req, res) => {
    res.render('modHomepage',{locals: {user: req.session.user}});
}

const userDashboardView = (req,res) => {
    res.render('userDashboard',{locals: {user: req.session.user}})
}


const officialChannelsView = (req,res) => {
    res.render('officialChannels',{locals: {user: req.session.user}});
}

const userChannelsView = (req,res) => {
    res.render('userChannels',{locals: {user: req.session.user}})
}

const postsListView = (req,res) => {
    res.render('posts',{locals: {user: req.session.user}})
}

const displayChannel = async (req,res) => {
    try {
        let ChannelName = req.path.split('/')[2];
        let channel = await searchByChannelName({name: ChannelName},mongoCredentials);
        res.render('officialChannelProfile',{locals : {user: req.session.user, name: channel.name}});
    }
    catch (error) {
        res.send(error);
    }
}

const displayUserChannel = async (req,res) => {
    try {
        let ChannelName = req.params.name;
        let channel = await getSingleChannel(ChannelName,req.session.user);
        res.render('userChannelProfile',{locals: {user: req.session.user, name: channel.name}});
    }
    catch (error) {
        res.status(400).send('No');
    }
}

module.exports = {
    homepageView,
    userDashboardView,
    officialChannelsView,
    userChannelsView,
    postsListView,
    displayChannel,
    displayUserChannel
}