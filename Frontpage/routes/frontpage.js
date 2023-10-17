const express = require('express')
const {frontpageView, login, registerView, isAuthenticated, isSessionActive, createSession, isUser, isMod, logout} = require('../controllers/FrontPageController');
const {createUser} = require("../../AppMod/controllers/MongoController");
const router = express.Router();

router.get('/',isSessionActive,frontpageView);
router.post('/login',login,createSession);
router.get('/register',isSessionActive,registerView);
router.post('/register',createUser,createSession);
router.use('/homepage',isUser,require('../../AppUser/routes/homepage'));
router.use('/mod',isMod,require('../../AppMod/routes/homepage'));
router.get('/logout',logout);

module.exports = router;