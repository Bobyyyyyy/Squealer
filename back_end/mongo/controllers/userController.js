const userModel = require('../models/userMethods');
const postModel = require("../models/postMethods");
const {createError} = require("../models/utils");
const {createMaxQuotaJob} = require("./CronController");


const addUser = async (req, res,next) => {
    try {
        req.response = (await userModel.addUser(req.body));
        if(typeof req.session.user === 'undefined') {
            next();
        }
        else {
            res.status(200).send(req.response);
        }
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}
const searchUser = async (req,res) => {
    try {
        res.send(await userModel.searchByUsername(req.body));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const changePassword = async (req,res) => {
    try {
        let username = req.body.username;
        let currentPsw = req.body.currentPsw;
        let newPsw = req.body.newPsw
        res.send(await userModel.changePwsd(username, currentPsw, newPsw));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getSessionUser = async (req,res) => {
    try {
        res.send({username: req.session.user});
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getUserProfileByName = async (req,res) => {
    try {
        res.send(await userModel.getUserProfilePicture(req.query.name));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const updateUserProfilePic = async (req, res) => {
    try {
        res.send(await userModel.updateProfilePicture(req.session.user, req.body.newProfilePic));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const updateSessionVip = async (req,res) => {
    try{
        req.session.vip = req.body.vipName;
        req.session.save();
        res.send({vip: req.session.vip})
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const smm2userSession = async (req,res) => {
    try{
        req.session.type = 'user'
        req.session.save();
        res.status(200).send({});
    }
    catch(err){
        if(typeof err.statusCode !== 'undefined')
            res.status(err.statusCode).send(err.message);
        else {
            res.status(500).send(err);
        }
    }
}

const getSessionVip = async (req,res) => {
    res.send({vip: req.session.vip})
}

const modifyUser = async(req,res) => {
    try{
        res.send(await userModel.altUser(req.body));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getAllUsers = async (req,res) => {
    try {
        res.status(200).send(await userModel.getUsers(req.query));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getSingleUser = async (req, res) => {
    try {
        res.status(200).send(await userModel.getSingleUser(req.query));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getUsersNumber = async (req,res) => {
    try {
        res.send(await userModel.usersLength(req.query));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getVips = async (req,res) => {
    try {
        res.send(await userModel.getHandledVip(req.query));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getQuota = async (req,res) => {
    try {
        let username = req.query.user;
        res.send(await userModel.getUserQuota(username));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const updateMaxQuota = async(req,res) => {

    try{
        let percentage= req.body.percentage;
        let user = req.session.type === 'smm' ? req.session.vip : req.session.user;

        if (isNaN(percentage)) throw createError('percentage not number', 404);  //cambiare

        let response = await userModel.updateMaxQuota(percentage,user)

        if (response instanceof Error){
            throw createError('upgrade della quota fallito', 404) // cambiare
        }

        //caso di errore -> preso dal catch;
        let tsyear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime();

        /*
        TODO: PER POPI, in caso di altri utilizzi, bisogna creare funzione che calcola il timestamp desiderato
         */
        await createMaxQuotaJob(tsyear,percentage,user);

        res.status(200).send({
                message:'upgrade avvenuto con successo!',
                newMaxQuota: response.maxQuota,
            });
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const updateRemainingQuota = async(req,res) => {
    try{
        let type = req.body.type;
        let user = req.session.type === 'smm' ? req.session.vip : req.session.user;
        if(!['D','W','M'].includes(type)) throw createError('tipo di quota invalido', 404);

        let response = await userModel.resetQuota(type,user);

        res.status(200).send({
            message:`quota ${type === 'D' ? 'giornaliera' : type === 'W' ? 'settimanale' : 'mensile'} resettata con successo`,
            newQuota: response}
        );
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getFollnPosts = async(req,res)=> {
    try {
        res.send(await userModel.get_n_FollnPosts(req.query));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getLastPost = async(req,res)=> {
    try {
        let response = await postModel.getLastPostUser(req.query)
        res.send({post: response});
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}


const clearDB = async (req,res) => {
    try{
        await userModel.clearDB();
        res.status(200).send('PIPPO');
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const deleteUser = async (req,res) => {
    try{
        res.status(200).send(await userModel.deleteUser(req.params.username));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getAllSmm = async (req, res) => {
    try {
        res.status(200).send(await userModel.getAllSmm(req.query));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const hireSmm = async (req, res) => {
    try {
        let vipUsername = req.body.vipUsername;
        let smmUsername = req.body.smmUsername;
        let isHiring = req.body.isHiring;
        res.status(200).send(await userModel.hireSmm(vipUsername, smmUsername, isHiring));
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}


module.exports = {
    addUser,
    searchUser,
    changePassword,
    getSessionUser,
    updateSessionVip,
    smm2userSession,
    getSessionVip,
    modifyUser,
    getAllUsers,
    getSingleUser,
    getUsersNumber,
    getVips,
    getQuota,
    getFollnPosts,
    getLastPost,
    updateMaxQuota,
    getUserProfileByName,
    updateUserProfilePic,
    clearDB,
    updateRemainingQuota,
    getAllSmm,
    hireSmm,
    deleteUser
}