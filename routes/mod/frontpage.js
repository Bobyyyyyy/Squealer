const express = require('express');
const {frontView, loginMod, ModHomeView} = require('../../controllers/mod/ModController');
const {createSession} = require("../../controllers/FrontPageController");
const router = express.Router();
router.get('/',frontView);
router.get('/homepage',ModHomeView);
router.post('/login',loginMod,createSession);
module.exports = router;