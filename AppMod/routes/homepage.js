const express = require('express');
const {homepageView, userDashboardView,officialChannelsView,privateChannelsView,postsListView} = require('../controllers/ModController');
const router = express.Router();
router.get('/',homepageView);
router.get('/users',userDashboardView);
router.get('/officialChannels',officialChannelsView);
router.get('/privateChannels',privateChannelsView);
router.get('/posts',postsListView);
module.exports = router;