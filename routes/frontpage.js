const express = require('express');
const {frontpageView, login, registerView, isAuthenticated, isSessionActive} = require('../controllers/FrontPageController');
const router = express.Router();
router.get('/',isSessionActive,frontpageView);
router.post('/login',login);
router.get('/register',registerView);
router.use('/homepage',isAuthenticated,require('./App/homepage'));
router.use('/mod',require('./mod/frontpage'))
module.exports = router;