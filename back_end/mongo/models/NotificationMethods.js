const connection = require('../ConnectionSingle');

/**
 * @param username
 * @returns {Promise<void>}
 */

const getNotification = async function (username) {
    try {
        await connection.get();
        return await Notification.find({user: username});
    }
    catch (error) {
        throw error;
    }
}

/**
 * @param username
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
}