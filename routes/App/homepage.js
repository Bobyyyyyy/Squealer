const express = require('express');
const {homeView} = require('../../controllers/App/AppController');
const {logout} = require("../../controllers/FrontPageController");
const router = express.Router();
router.get('/',homeView);
router.get('/logout',logout);
module.exports = router;