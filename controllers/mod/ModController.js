const {loginUser} = require("../../dbScripts/userMethods");
const {mongoCredentials} = require("../../dbScripts/utils");

const frontView = (req,res) => {
    res.render('./mod/frontpage');
}

const loginMod  = async (req,res,next) => {
    try {
        req.response = await loginUser(req.body, mongoCredentials);
        next();
    } catch (Error) {
        res.redirect('/mod');
    }
}

const ModHomeView = (req,res) => {
    res.render('./mod/homepage');
}

module.exports = {
    frontView,
    loginMod,
    ModHomeView
}