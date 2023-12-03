const mongoose= require('mongoose');
const NotificationSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true,
    },

    sender: {
        type: String,
        required: true
    },

    channel: {
        type: String,
        required: false,
    }

})

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;