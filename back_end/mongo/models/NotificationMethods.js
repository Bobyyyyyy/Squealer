const connection = require('../ConnectionSingle');
const {getSingleChannel} = require("./ChannelMethods");
const Channel = require("../schemas/Channel");
const Notification = require("../schemas/Notification")

/**
 * @param {String} username
 * @returns {Promise<void>}
 */

const getNotification = async function (username) {
    try {
        await connection.get();
        let notifications = await Notification.find({user: username});

        for (const notification of notifications) {
            let channel = await Channel.findById(notification.channel)
            notification.channel = channel.name;
        }

        return notifications;
    }
    catch (error) {
        throw error;
    }
}

/**
 * @param {String} username
 * @returns {Promise<*>}
 */
const deleteNotification = async function(username) {
    try {
        await connection.get();
        await Notification.deleteMany({user:username});
    }
    catch (error) {
        throw error;
    }
}





module.exports = {
    getNotification,
    deleteNotification,
}