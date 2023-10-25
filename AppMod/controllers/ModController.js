
const homepageView = (req, res) => {
    res.render('modHomepage.html');
}

const userDashboardView = (req,res) => {
    res.render('userDashboard.html')
}


const officialChannelsView = (req,res) => {
    res.render('officialChannels.html');
}

const privateChannelsView = (req,res) => {
    res.render('officialChannels.html')
}

const postsListView = (req,res) => {
    res.render('posts.html')
}

module.exports = {
    homepageView,
    userDashboardView,
    officialChannelsView,
    privateChannelsView,
    postsListView
}