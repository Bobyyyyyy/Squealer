const {mongoCredentials} = require('../models/utils.js')
const userModel = require('../models/userMethods');
const postModel = require("../models/postMethods");


const addUser = async (req, res, next) => {
    try {
        req.response = await userModel.addUser(req.body, mongoCredentials);
        next();
    } catch (Error) {
        res.redirect('/register');
    }
}
const searchUser = async (req,res) => {
    res.send(await userModel.searchByUsername(req.body,mongoCredentials));
}

const changePassword = async (req,res) => {
    res.send(await userModel.changePwsd(req.body,mongoCredentials));
}

const getSessionUser = async (req,res) => {
    res.send({username: req.session.user});
}

const updateSessionVip = async (req,res) => {
    try{
        req.session.vip = req.body.vipName;
        req.session.save();
        res.send({vip: req.session.vip})
    }catch (e) {
        console.log(e)
    }
}
const getSessionVip = async (req,res) => {
    res.send({vip: req.session.vip})
}

const modifyUser = async(req,res) => {
    try{
        res.send(await userModel.altUser(req.body,mongoCredentials));
    }
    catch(error) {
        res.send(error);
    }
}

const getAllUsers = async (req,res) => {
    try {
        res.send(await userModel.getUsers(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getUsersNumber = async (req,res) => {
    try {
        res.send(await userModel.usersLength(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getVips = async (req,res) => {
    try {
        res.send(await userModel.getHandledVip(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getQuota = async (req,res) => {
    try {
        res.send(await userModel.getUserQuota(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getFollnPosts = async(req,res)=> {
    try {
        res.send(await userModel.get_n_FollnPosts(req.query,mongoCredentials));
    }
    catch (error) {
        res.send(error);
    }
}

const getLastPost = async(req,res)=> {
    try {
        let response = await postModel.getLastPostUser(req.query, mongoCredentials)
        res.send({post: response});
    } catch (error) {
        res.send(error);
    }
}

module.exports = {
    addUser,
    searchUser,
    changePassword,
    getSessionUser,
    updateSessionVip,
    getSessionVip,
    modifyUser,
    getAllUsers,
    getUsersNumber,
    getVips,
    getQuota,
    getFollnPosts,
    getLastPost,
}