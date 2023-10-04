const {addPost} = require('../dbScripts/postMethods');
const {addUser, searchByUsername, changePwsd} = require('../dbScripts/userMethods');
const {mongoCredentials} = require('../dbScripts/utils.js')

const createUser = async (req,res) => {
    try {
        let response = await addUser(req.body,mongoCredentials);
        req.session.regenerate(function () {
            req.session.authenticated = true;
            req.session.user = response.username;
            console.log(response);
            console.log(req.session);
            req.session.save();
            res.redirect('/homepage');
        });
    }
    catch (Error) {
        res.redirect('/register');
    }
}

const createPost = async (req,res) => {
    res.send(await addPost(760,req.body,mongoCredentials));
}

const searchUser = async (req,res) => {
    res.send(await searchByUsername(req.body,mongoCredentials));
}

const changePassword = async (req,res) => {
    res.send(await changePwsd(req.body,mongoCredentials));
}


module.exports = {
    createUser,
    createPost,
    searchUser,
    changePassword,
}