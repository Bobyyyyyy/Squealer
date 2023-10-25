const {addPost} = require('../scripts/postMethods');
const {addUser, searchByUsername, changePwsd, getUsers, usersLength, altUser, getHandledVip} = require('../scripts/userMethods');
const {mongoCredentials} = require('../scripts/utils.js')

const createUser = async (req,res,next) => {
    try {
        req.response = await addUser(req.body, mongoCredentials);
        next();
    } catch (Error) {
        res.redirect('/register');
    }
}

const createPost = async (req,res) => {
    res.send(await addPost(req.body,mongoCredentials));
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

const getVips = async (req,res) => {
    try {
        res.send(await getHandledVip(req.query,mongoCredentials));
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
    modifyUser,
    getVips
}