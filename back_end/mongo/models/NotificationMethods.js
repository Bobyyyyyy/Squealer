const mongoose = require('mongoose');
const User = require("../schemas/User");
const {connectdb} = require("./utils");

/**
 * @param username
 * @param credentials
 * @returns {Promise<void>}
 */

const getNotification = async function (username, credentials) {
    try {
        await connectdb(credentials);
        let notifications = await Notification.find({user: username});
        await mongoose.connection.close();
        return notifications;
    }
    catch (error) {
        throw error;
    }
}

/**
 * @param username
 * @param credentials
 * @returns {Promise<*>}
 */
const deleteNotification = async function(username,credentials) {
    try {
        await connectdb(credentials);
        await Notification.deleteMany({user:username});
        await mongoose.connection.close();
    }
    catch (error) {
        throw error;
    }
}





module.exports = {
    getNotification,
}