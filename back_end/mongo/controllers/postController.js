const {mongoCredentials} = require('../models/utils.js')
const postModel = require("../models/postMethods");


const createPost = async (req,res) => {
    try{

        res.send(await postModel.addPost(req.body,mongoCredentials));
    }
    catch (err){
        console.log(err);
        res.send(err)
    }
}

const getPosts = async (req,res) => {
    try {
        res.send(await postModel.getAllPost(req.query,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const updateReaction = async (req,res) => {
    try {
        res.send(await postModel.updateReac(req.body,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const deleteReaction = async (req,res) => {
    try {
        res.send(await postModel.deleteReac(req.body,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const removePost = async (req,res) => {
    try {
        let body = {id: req.body.id, name: req.session.user, type: req.session.type}
        res.send(await postModel.deletePost(body,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

module.exports = {
    createPost,
    getPosts,
    updateReaction,
    deleteReaction,
    removePost,
}