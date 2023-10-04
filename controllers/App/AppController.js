
const homeView = (req,res) => {
    res.render('./App/homepage');
}

const logout = (req,res) => {
    req.session.destroy();
    res.redirect('/');
}


module.exports = {
    homeView,
    logout
}