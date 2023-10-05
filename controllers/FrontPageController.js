const {loginUser} = require("../dbScripts/userMethods");
const {mongoCredentials} = require("../dbScripts/utils");

const registerView = (req, res) => {
    res.render("App/register", {
    });
}


const frontpageView = (req,res) => {
        res.render("frontpage",{
    });
}

const login  = async (req,res) => {
    try {
        let response = await loginUser(req.body, mongoCredentials);
        req.session.regenerate(function () {
            req.session.authenticated = true;
            req.session.user = response.username;
            console.log(response);
            console.log(req.session);
            req.session.save();
            res.redirect('/homepage');
        });
    } catch (Error) {
        res.redirect('/register');
    }
}

const isAuthenticated = (req,res,next) => {
    if(req.session.authenticated) {
        next();
    }
    else {
        res.redirect('/');
    }
}

const isSessionActive = (req,res,next) => {

    // bisogna vedere ma con quale account si è autorizzati (USER,MM,SMM)
    if(!req.session.authenticated) {
        next();
    }

    else {
        res.redirect('/homepage');
    }
}

module.exports = {
    frontpageView,
    registerView,
    login,
    isAuthenticated,
    isSessionActive,
};