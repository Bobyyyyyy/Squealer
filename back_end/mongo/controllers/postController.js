const {mongoCredentials} = require('../models/utils.js')
const postModel = require("../models/postMethods");
const {createScheduledPost} = require("./CronController");


const createPost = async (req,res) => {
    try{
        let postSavedId = await postModel.addPost(req.body,mongoCredentials)
        if (req.body.post?.timed){
            await createScheduledPost(postSavedId.postId, req.body.post.frequency, req.body.post.squealNumber, req.body.post.content, req.body.post.contentType);
        }
        res.send({id: postSavedId});
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
        if(req.session.type === 'mod') {
                await postModel.updateReac(req.body, mongoCredentials);
                res.sendStatus(200);
        }
        await postModel.updateReac({user: req.body.user, rtype: req.body.keys},mongoCredentials)
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

const postLength = async (req,res) => {
    try {
        console.log(req.query);
        res.send(await postModel.postLength(req.query.filter,mongoCredentials))
    }
    catch (error) {
        res.send(error);
    }

}

module.exports = {
    createPost,
    getPosts,
    updateReaction,
    deleteReaction,
    removePost,
    postLength
}