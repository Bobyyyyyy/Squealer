const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/channelsController');
const officialChannelsController = require("../controllers/officialChannelsController");

router.post('/',channelsController.createChannel);
router.get('/',channelsController.getChannels);
router.get('/check',channelsController.checkUserInChannel);
router.get('/number',channelsController.getChannelsNumber);
router.get('/channelPic', channelsController.getChannelProfilePicByName);
router.put('/channelPic', channelsController.updateChannelProfilePic);
router.get('/:name',channelsController.getSingleChannel);
router.put('/block',channelsController.blockChannel);
router.put('/name',channelsController.changeChannelName);
router.post('/follower',channelsController.addFollower);
router.put('/requests',channelsController.handleRequest);
router.put('/permissions',channelsController.handlePermission);
router.put('/admin',channelsController.addAdmin);
router.post('/delete',channelsController.deleteChannel);


module.exports = router