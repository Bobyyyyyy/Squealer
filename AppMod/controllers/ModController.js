const {getChannels, searchByChannelName} = require("../../public/scripts/ReservedChannelMethods");

const homepageView = (req, res) => {
    res.render('modHomepage.html',{locals: {user: req.session.user}});
}

const userDashboardView = (req,res) => {
    res.render('userDashboard.html',{locals: {user: req.session.user}})
}


const officialChannelsView = (req,res) => {
    res.render('reservedChannels.html',{locals: {user: req.session.user}});
}

const privateChannelsView = (req,res) => {
    res.render('reservedChannels.html',{locals: {user: req.session.user}})
}

const postsListView = (req,res) => {
    res.render('posts.html',{locals: {user: req.session.user}})
}

const displayChannel = async (req,res) => {
    try {
        let ChannelName = req.path.split('/')[2];
        let channel = await searchByChannelName({name: ChannelName});
        res.render('reservedChannelProfile.html',{locals : {user: req.session.user, name: channel.name}});
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