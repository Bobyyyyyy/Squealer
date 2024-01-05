const postModel = require("../models/postMethods");
const CronController = require("./CronController");
const {mongo} = require("mongoose");
const {createError} = require("../models/utils");


const createPost = async (req,res) => {
    try{
        let postSaved = await postModel.addPost(req.body.post, req.body.quota)
        if (typeof req.body.post.timed !== "undefined" && (req.body.post.timed === "true" || req.body.post.timed === true) && req.body.post.contentType !== "geolocation") {
            await CronController.createScheduledPost(postSaved.post._id, parseInt(req.body.post.millis), parseInt(req.body.post.squealNumber), req.body.post.content, req.body.post.contentType);
        }
        res.send(postSaved)
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const getPosts = async (req,res) => {
    try {
        res.send(await postModel.getAllPost(req.query,{username: req.session.user, typeUser: req.session.type}));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const updateReaction = async (req,res) => {
    try {
        if(req.session.type === 'mod') {
                await postModel.updateReac({user: req.session.user, typeUser: req.session.type, reactions: req.body.reactions,postId: req.body.postId});
                res.send('200');
        }
        else {
            let user = req.session.type === 'smm' ? req.session.vip : req.session.user;
            await postModel.updateReac({user: user, typeUser: req.session.type, reaction: req.body.reaction, postId: req.body.postId});
            res.send('200');
        }
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const deleteReaction = async (req,res) => {
    try {
        res.send(await postModel.deleteReac(req.body))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const removePost = async (req,res) => {
    try {
        res.send(await postModel.removeDestination(req.body.destination,req.body.postID))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const getPostsDate = async (req,res) => {
    try{
        await res.send(await postModel.getPostsDate(req.query.user, req.query.onlyMonth));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const getReactionLast30days = async (req,res) => {
    try{
        await res.send(await postModel.getReactionLast30days(req.query.user, req.query?.channel));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const postLength = async (req,res) => {
    try {
        res.send(await postModel.postLength(req.query.filter))
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const addDestination = async(req,res) => {
    try {
        res.send(await postModel.addDestination(req.body.destination, req.body.postID));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const addPosition = async(req,res) => {
    try {
        res.send(await postModel.addPosition(req.body.newPosition, req.body.postID));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const getHomePosts = async (req, res) => {
    try{
        let limit = req.query.limit;
        let offset = req.query.offset;
        if (isNaN(limit) || isNaN(offset))
            throw createError('bad request', 400);

        let user = req.session.user;

        res.send(await postModel.getPostHome(user, limit, offset))
    }
    catch(Error){
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const getPostsByUser2watch = async (req,res) => {
    try{
        let limit = req.query.limit;
        let offset = req.query.offset;
        if (isNaN(limit) || isNaN(offset))
            throw createError('bad request', 400);

        let user = req.session.user;
        let user2watch = req.query.user2watch;

        res.send(await postModel.getPostByUsername2watch(user, limit, offset, user2watch))
    }
    catch(Error){
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}

const getPostsByProfile = async (req, res) => {
    try{
        let limit = req.query.limit;
        let offset = req.query.offset;
        if (isNaN(limit) || isNaN(offset))
            throw createError('bad request', 400);

        let user = req.session.user;
        res.send(await postModel.getPostByProfile(user, limit, offset));
    }
    catch(Error){
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
    }
}


const getPostHomeAnonymous = async (req, res) => {
    try{
        let limit = req.query.limit;
        let offset = req.query.offset;
        if (isNaN(limit) || isNaN(offset))
            throw createError('bad request', 400);

        res.send(await postModel.getPostHomeAnonymous(limit, offset));
    }
    catch(Error){
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send({message: Error.message});
        else {
            res.status(500).send(Error);
        }
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
    addDestination,
    addPosition,
    getHomePosts,
    getPostsByUser2watch,
    getPostsByProfile,
    getPostHomeAnonymous
}