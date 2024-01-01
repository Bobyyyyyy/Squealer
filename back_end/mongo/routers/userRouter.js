const express = require('express');

const userController = require('../controllers/userController');
const router = express.Router();

/* User Methods */
router.post('/',userController.addUser);
router.put('/',userController.modifyUser);
router.get('/profilePic', userController.getUserProfileByName);
router.put('/profilePic', userController.updateUserProfilePic);
router.get('/session',userController.getSessionUser);
router.get('/number',userController.getUsersNumber);
router.get('/all',userController.getAllUsers);
router.get('/singleuser',userController.getSingleUser);
router.get('/getVips',userController.getVips)
router.get('/quota',userController.getQuota);
router.put('/maxquota', userController.updateMaxQuota);
router.put('/quota', userController.updateRemainingQuota)
router.put('/sessionVip',userController.updateSessionVip);
router.get('/sessionVip', userController.getSessionVip);
router.put('/smm2user', userController.smm2userSession);
router.get('/info',userController.getFollnPosts);
router.get('/lastPost',userController.getLastPost);
router.get('/allSmm', userController.getAllSmm);
router.put('/hireSmm', userController.hireSmm);
router.delete('/delete', userController.deleteUser);
router.put('/resetpswd', userController.resetPswd);

//router.put('/session', userController.modifyUser);
router.delete('/clearDB', userController.clearDB);

module.exports = router;