const express = require('express');
const {homeView} = require('../controllers/AppController');
const {logout} = require("../../Frontpage/controllers/FrontPageController");
const router = express.Router();
router.get('/',homeView);
router.get('/logout',logout);
module.exports = router;