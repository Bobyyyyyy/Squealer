const {addPost} = require('../../dbScripts/postMethods');
const {addUser, searchByUsername, changePwsd, getUsers, usersLength, altUser} = require('../../dbScripts/userMethods');
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

const getSessionUser = async (req,res) => {
    res.send({username: req.session.user});
}

const modifyUser = async(req,res) => {
    try{
        res.send(await altUser(req.body,mongoCredentials));
    }
    catch(error) {
        res.send(error);
    }
}

const getAllUsers = async (req,res) => {
    try {
        res.send(await getUsers(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getUsersNumber = async (req,res) => {
    try {
        res.send(await usersLength(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

module.exports = {
    createUser,
    createPost,
    searchUser,
    changePassword,
    getSessionUser,
    getAllUsers,
    getUsersNumber,
    modifyUser
}