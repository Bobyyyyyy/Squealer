const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/channelsController');

router.post('/',channelsController.createChannel);
router.get('/',channelsController.getChannels);
router.get('/list',channelsController.getChannelList);
router.get('/check',channelsController.checkUserInChannel);
router.get('/number',channelsController.getChannelsNumber);
router.get('/:name',channelsController.getSingleChannel);
router.put('/block',channelsController.blockChannel);
router.put('/name',channelsController.changeChannelName);
router.post('/follower',channelsController.addFollower);
router.put('/requests',channelsController.handleRequest);
router.post('/admin',channelsController.addAdmin);

module.exports = router