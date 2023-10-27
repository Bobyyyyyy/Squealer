const express = require('express');
const {createUser,createPost, getSessionUser, getAllUsers, getUsersNumber, modifyUser, getVips,
    createReservedChannel, addFollowers, addAdmins, deleteCh, getChannelsNumber, getChannel
} = require('../controllers/MongoController');
const router = express.Router();


/* User Methods */
router.post('/user',createUser,(req,res) => {
    res.redirect('/mod/users');
});
router.put('/user',modifyUser);
router.get('/userid',getSessionUser);
router.get('/nusers',getUsersNumber);
router.get('/users',getAllUsers);
router.get('/getVips',getVips)

/* Post Methods */
router.post('/addPost',createPost);


/* Channel Methods*/
router.post('/ReservedChannel',createReservedChannel, (req,res) => {
    res.redirect('/mod/officialChannels');
});
router.post('/ReservedChannel/addFollower/',addFollowers);
router.post('/ReservedChannel/addAdmin/',addAdmins);
router.post('/ReservedChannel/delete',deleteCh);
router.get('/nReservedChannel',getChannelsNumber);
router.get('/ReservedChannel',getChannel);
module.exports = router;