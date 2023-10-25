const express = require('express');
const {createUser,createPost, getSessionUser, getAllUsers, getUsersNumber, modifyUser, getVips,
    createReservedChannel, addFollowers, addAdmins
} = require('../controllers/MongoController');
const router = express.Router();

router.post('/user',createUser,(req,res) => {
    res.redirect('/mod/users');
});
router.put('/user',modifyUser);
router.post('/addPost',createPost);
router.get('/userid',getSessionUser);
router.get('/nusers',getUsersNumber);
router.get('/users',getAllUsers);
router.get('/getVips',getVips);
router.post('/ReservedChannel',createReservedChannel);
router.post('/ReservedChannel/addFollower/',addFollowers);
router.post('/ReservedChannel/addAdmin/',addAdmins);

module.exports = router;