const express = require('express');
const {homepageView, userDashboardView,officialChannelsView,userChannelsView,postsListView, displayChannel,
    displayUserChannel
} = require('../controllers/ModController');
const router = express.Router();
router.get('/',homepageView);
router.get('/users',userDashboardView);

router.get('/officialChannels',officialChannelsView);
router.get('/officialChannels/:name',displayChannel)


router.get('/userChannels',userChannelsView);
router.get('/userChannels/:name',displayUserChannel)



router.get('/posts',postsListView);
module.exports = router;