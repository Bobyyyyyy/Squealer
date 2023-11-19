const express = require('express')
const frontPageController = require('../controllers/FrontPageController');
const userController = require('../../mongo/controllers/userController');
const router = express.Router();

router.get('/',frontPageController.isSessionActive,frontPageController.frontpageView);
router.post('/login',frontPageController.login,frontPageController.createSession);
router.get('/register',frontPageController.isSessionActive,frontPageController.registerView);
router.post('/register',userController.addUser,frontPageController.createSession);
router.use('/mod',frontPageController.isMod,require('../../AppMod/routes/homepage'));
router.get('/logout',frontPageController.logout);
module.exports = router;