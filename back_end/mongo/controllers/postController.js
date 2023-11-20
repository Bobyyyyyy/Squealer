const {mongoCredentials} = require('../models/utils.js')
const postModel = require("../models/postMethods");
const {createScheduledPost} = require("./CronController");


const createPost = async (req,res) => {
    try{
        let postSavedId = await postModel.addPost(req.body.post, req.body.quota,mongoCredentials)
        if (req.body.post?.timed) {
            await createScheduledPost(postSavedId.postId, req.body.post.frequency, req.body.post.squealNumber, req.body.post.content, req.body.post.contentType);
        }
        res.send({id: postSavedId})
    }
    catch (err){
        console.log(err);
        res.send(err)
    }
}

const getPosts = async (req,res) => {
    try {
        res.send(await postModel.getAllPost(req.query,req.session.user,mongoCredentials))
    }
    catch(error) {
        res.send(error);
    }
}

const updateReaction = async (req,res) => {
    try {
        if(req.session.type === 'mod') {
                await postModel.updateReac(req.body, mongoCredentials);
                res.send('200');
        }
        else {
            await postModel.updateReac({user: req.body.user, rtype: req.body.keys}, mongoCredentials)
            res.send(await postModel.updateReac(req.body, mongoCredentials));
        }
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

const getPostsDate = async (req,res) => {
    try{
        await res.send(await postModel.getPostsDate(req.query.user, req.query.onlyMonth));
    }
    catch (e) {
        throw e;
    }
}

const getReactionLast30days = async (req,res) => {
    try{
        await res.send(await postModel.getReactionLast30days(req.query.user, req.query?.channel));
    }
    catch (e) {
        throw e;
    }
}

const postLength = async (req,res) => {
    try {
        res.send(await postModel.postLength(req.query.filter,req.query.channel,mongoCredentials))
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
    getPostsDate,
    getReactionLast30days,
    postLength
}