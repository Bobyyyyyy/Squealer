const express = require('express');
const {frontpageView, login, registerView, isAuthenticated, isSessionActive, createSession, isUser, isMod, logout} = require('../controllers/FrontPageController');
const router = express.Router();
router.get('/',isSessionActive,frontpageView);
router.post('/login',isSessionActive,login,createSession);
router.get('/register',isSessionActive,registerView);
router.use('/homepage',isUser,require('./App/homepage'));
router.use('/mod',isMod,require('./mod/homepage'))
router.get('/logout',logout);
module.exports = router;