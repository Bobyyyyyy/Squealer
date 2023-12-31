const express = require('express');
const router = express.Router();
const officialChannelsController = require('../controllers/officialChannelsController');

router.post('/',officialChannelsController.createReservedChannel);
router.get('/',officialChannelsController.channel);
router.put('/',officialChannelsController.modifyDesc);
router.post('/delete',officialChannelsController.deleteCh);

router.get('/number',officialChannelsController.getChannelsNumber);
router.get('/all',officialChannelsController.getChannel);

router.get('/channelPic', officialChannelsController.getChannelProfilePicByName);
router.put('/channelPic', officialChannelsController.updateChannelProfilePic);

module.exports = router;
