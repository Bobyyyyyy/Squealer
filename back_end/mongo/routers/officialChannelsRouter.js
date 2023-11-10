const express = require('express');
const router = express.Router();
const officialChannelsController = require('../controllers/officialChannelsController');

router.post('/',officialChannelsController.createReservedChannel, (req,res) => {
    res.redirect('/mod/officialChannels');
});
router.get('/',officialChannelsController.channel);
router.put('/',officialChannelsController.modifyDesc);
router.post('/delete',officialChannelsController.deleteCh);

router.get('/number',officialChannelsController.getChannelsNumber);
router.get('/all',officialChannelsController.getChannel);

module.exports = router;
