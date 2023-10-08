const express = require('express');
const {frontView, loginMod, ModHomeView} = require('../../controllers/mod/ModController');
const {createSession, logout} = require("../../controllers/FrontPageController");
const router = express.Router();
router.get('/',ModHomeView);
module.exports = router;