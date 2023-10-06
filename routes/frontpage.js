const express = require('express');
const {frontpageView, login, registerView, isAuthenticated, isSessionActive, createSession, isUser, isMod} = require('../controllers/FrontPageController');
const router = express.Router();
router.get('/',isSessionActive,frontpageView);
router.post('/login',isSessionActive,login,createSession);
router.get('/register',isSessionActive,registerView);
router.use('/homepage',require('./App/homepage'));
router.use('/mod',require('./mod/frontpage'))
module.exports = router;