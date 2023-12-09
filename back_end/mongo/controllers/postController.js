const postModel = require("../models/postMethods");
const CronController = require("./CronController");
const {mongo} = require("mongoose");


const createPost = async (req,res) => {
    try{
        let postSavedId = await postModel.addPost(req.body.post, req.body.quota)
        if (req.body.post?.timed) {
            await CronController.createScheduledPost(postSavedId.postId, req.body.post.frequency, req.body.post.squealNumber, req.body.post.content, req.body.post.contentType);
        }
        res.send({id: postSavedId})
    }
    catch (error){
        res.status(error.statusCode).send({message: error.mes});
    }
}

const getPosts = async (req,res) => {
    try {
        res.send(await postModel.getAllPost(req.query,req.session.user))
    }
    catch(error) {
        res.send(error);
    }
}

const updateReaction = async (req,res) => {
    try {
        if(req.session.type === 'mod') {
                await postModel.updateReac(req.body);
                res.send('200');
        }
        else {
            await postModel.updateReac(req.body);
            res.send('200');
        }
    }
    catch(error) {
        res.send(error);
    }
}

const deleteReaction = async (req,res) => {
    try {
        res.send(await postModel.deleteReac(req.body))
    }
    catch(error) {
        res.send(error);
    }
}

const removePost = async (req,res) => {
    try {
        res.send(await postModel.removeDestination(req.body.destination,req.body.postID))
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
        res.send(await postModel.postLength(req.query.filter))
    }
    catch (error) {
        res.send(error);
    }
}

const addDestination = async(req,res) => {
    try {
        res.send(await postModel.addDestination(req.body.destination, req.body.postID));
    }
    catch (error) {
        res.status(400).send(error);
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
    postLength,
    addDestination
}