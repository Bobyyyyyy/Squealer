const notificationModel = require('../models/NotificationMethods');
const {createError} = require("../models/utils");

const getNotifications = async(req,res) => {
    try{
        if(req.query.user) res.send(await notificationModel.getNotification(req.query.user));
        else throw createError('insert user', 404);
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        res.status(500).send(Error);
    }
}
const deleteNotifications = async(req,res) => {
    try{
        let user = req.session.type === 'smm' ? req.session.vip : req.session.user;
        if(user) res.send(await notificationModel.deleteNotification(user));
        else throw createError('insert user', 404);
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        res.status(500).send(Error);
    }
}

module.exports = {
    getNotifications,
    deleteNotifications
}