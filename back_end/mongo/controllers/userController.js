const userModel = require('../models/userMethods');
const postModel = require("../models/postMethods");
const {createError} = require("../models/utils");
const {createMaxQuotaJob} = require("./CronController");


const addUser = async (req, res, next) => {
    try {
        req.response = await userModel.addUser(req.body);
        next();
    } catch (Error) {
        res.redirect('/register');
    }
}
const searchUser = async (req,res) => {
    try {
        res.send(await userModel.searchByUsername(req.body));
    } catch (err) {
        res.status(err.statusCode).send(err.message);
    }
}

const changePassword = async (req,res) => {
    res.send(await userModel.changePwsd(req.body));
}

const getSessionUser = async (req,res) => {
    try {
        res.send({username: req.session.user});
    } catch (err) {
        res.status(err.statusCode).send(err.message);
    }
}

const getUserProfileByName = async (req,res) => {
    try {
        res.send(await userModel.getUserProfilePicture(req.query.name));
    } catch (err) {
        res.status(err.statusCode).send(err.message);
    }
}

const updateUserProfilePic = async (req, res) => {
    try {
        res.send(await userModel.updateProfilePicture(req.session.user, req.body.newProfilePic));
    } catch (err) {
        res.status(400).send("errore nel cambiamento dell'immagine");
    }
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
        res.send(await userModel.altUser(req.body));
    }
    catch(error) {
        res.send(error);
    }
}

const getAllUsers = async (req,res) => {
    try {
        res.status(200).send(await userModel.getUsers(req.query));
    }
    catch (error) {
        res.status(error.statusCode).send(error.message);
    }
}

const getSingleUser = async (req, res) => {
    try {
        res.status(200).send(await userModel.getSingleUser(req.query));
    } catch (error) {
        res.status(error.statusCode).send(error.message);
    }
}

const getUsersNumber = async (req,res) => {
    try {
        res.send(await userModel.usersLength(req.query));
    }
    catch (error) {
        res.send(error);
    }
}

const getVips = async (req,res) => {
    try {
        res.send(await userModel.getHandledVip(req.query));
    }
    catch (error) {
        res.send(error);
    }
}

const getQuota = async (req,res) => {
    try {
        let username = req.query.user;
        res.send(await userModel.getUserQuota(username));
    }
    catch (error) {
        res.send(error);
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
    }
    catch(err){
        res.status(err.statusCode).send({message: err.message});
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
    }
    catch (err) {
        res.status(err.statusCode).send(err.message);
    }
}

const getFollnPosts = async(req,res)=> {
    try {
        res.send(await userModel.get_n_FollnPosts(req.query));
    }
    catch (error) {
        res.send(error);
    }
}

const getLastPost = async(req,res)=> {
    try {
        let response = await postModel.getLastPostUser(req.query)
        res.send({post: response});
    } catch (error) {
        res.send(error);
    }
}


const clearDB = async (req,res) => {
    try{
        await userModel.clearDB();
        res.status(200).send('PIPPO');
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getAllSmm = async (req, res) => {
    try {
        res.status(200).send(await userModel.getAllSmm(req.query));
    } catch (error) {
        res.send(error);
    }
}

const hireSmm = async (req, res) => {
    try {
        let vipUsername = req.body.vipUsername;
        let smmUsername = req.body.smmUsername
        let response = await userModel.hireSmm(vipUsername, smmUsername);
        res.status(200).send({ hired: true});
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
    hireSmm
}