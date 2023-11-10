const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/channelsController');

router.post('/',channelsController.createChannel);
router.get('/list',channelsController.getChannelList);
router.get('/check',channelsController.checkUserInChannel);

module.exports = router