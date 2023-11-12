const {loginUser} = require("../../mongo/models/userMethods");
const {mongoCredentials} = require("../../mongo/models/utils");

const registerView = (req, res) => {
    res.render("register", {
    });
}


const frontpageView = (req,res) => {
        res.render("frontpage",{
    });
}

const login  = async (req,res,next) => {
    try {
        req.response = await loginUser(req.body, mongoCredentials);
        next();
    } catch (Error) {
        res.redirect('/register');
    }
}

const isUser = (req,res,next) => {
    if(req.session.authenticated && (req.session.type === 'user' || req.session.type === 'vip') ) {
        next();
    }
    else {
        res.redirect('/');
    }
}

const isMod = (req,res,next) => {
    if(req.session.authenticated && req.session.type === 'mod') {
        next();
    }
    else {
        res.redirect('/');
    }
}

const isSMM = (req,res,next) => {
    if(req.session.authenticated && req.session.type === 'smm' ) {
        next();
    }
    else {
        res.redirect('/');
    }
}

const isSessionActive = (req,res,next) => {
    if(!req.session.authenticated) {
        next();
    }
    else {
        switch (req.session.type) {
            case 'user':
                res.redirect('/user')
                break;

            case 'mod':
                res.redirect('/mod');
                break;

            case 'smm':
                res.redirect('/SMM');
        }
    }
}

const createSession = async(req,res) => {
    req.session.regenerate(function () {
        req.session.authenticated = true;
        req.session.user = req.response.username;
        req.session.type = req.response.typeUser;
        /*
        console.log(req.response);
        console.log(req.session);

         */
        req.session.save();
      
        switch (req.response.typeUser) {
            case 'user':
            case 'vip':
                res.redirect('/user');
                break;

            case 'mod':
                res.redirect('/mod');
                break;

            case 'smm':
                res.redirect('/SMM/');
                break;
        }
    });
}


const logout = (req,res) => {
    req.session.destroy();
    res.redirect('/');
}

module.exports = {
    frontpageView,
    registerView,
    login,
    isUser,
    isMod,
    isSMM,
    isSessionActive,
    createSession,
    logout,
};