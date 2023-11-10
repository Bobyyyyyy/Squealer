const {getChannels, searchByChannelName} = require("../../mongo/models/officialChannelsMethods");

const homepageView = (req, res) => {
    res.render('modHomepage',{locals: {user: req.session.user}});
}

const userDashboardView = (req,res) => {
    res.render('userDashboard',{locals: {user: req.session.user}})
}


const officialChannelsView = (req,res) => {
    res.render('officialChannels',{locals: {user: req.session.user}});
}

const privateChannelsView = (req,res) => {
    res.render('officialChannels',{locals: {user: req.session.user}})
}

const postsListView = (req,res) => {
    res.render('posts',{locals: {user: req.session.user}})
}

const displayChannel = async (req,res) => {
    try {
        let ChannelName = req.path.split('/')[2];
        let channel = await searchByChannelName({name: ChannelName});
        res.render('officialChannelProfile',{locals : {user: req.session.user, name: channel.name}});
    }
    catch (error) {
        res.send(error);
    }
}

module.exports = {
    homepageView,
    userDashboardView,
    officialChannelsView,
    privateChannelsView,
    postsListView,
    displayChannel
}