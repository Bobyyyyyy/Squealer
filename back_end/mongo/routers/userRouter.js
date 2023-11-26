const express = require('express');

const userController = require('../controllers/userController');
const router = express.Router();

/* User Methods */
router.post('/',userController.addUser,(req,res) => {
    res.redirect('/mod/users');
});
router.put('/',userController.modifyUser);
router.get('/profilePic', userController.getUserProfilePic);
router.get('/session',userController.getSessionUser);
router.get('/number',userController.getUsersNumber);
router.get('/all',userController.getAllUsers);
router.get('/getVips',userController.getVips)
router.get('/quota',userController.getQuota);
router.put('/quota', userController.updateMaxQuota);
router.put('/sessionVip',userController.updateSessionVip);
router.get('/sessionVip', userController.getSessionVip);
router.get('/info',userController.getFollnPosts);
router.get('/lastPost',userController.getLastPost);

//router.put('/session', userController.modifyUser);

module.exports = router;