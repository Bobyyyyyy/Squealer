const {addPost} = require('../../dbScripts/postMethods');
const {addUser, searchByUsername, changePwsd} = require('../../dbScripts/userMethods');
const {mongoCredentials} = require('../../dbScripts/utils.js')

const createUser = async (req,res,next) => {
    try {
        req.response = await addUser(req.body, mongoCredentials);
        next();
    } catch (Error) {
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