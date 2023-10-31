const express = require('express');
const {createUser,createPost, getSessionUser, getAllUsers, getUsersNumber, modifyUser, getVips,
    createReservedChannel, addFollowers, addAdmins, deleteCh, getChannelsNumber, getChannel, createChannel, getChannelList, getPosts, displayChannel,
    channel,
    modifyDesc
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
router.get('/posts',getPosts);

/* Reserved Channel Methods*/
router.post('/ReservedChannel',createReservedChannel, (req,res) => {
    res.redirect('/mod/officialChannels');
});
router.get('/ReservedChannel',channel);
router.put('/ReservedChannel',modifyDesc);
router.post('/ReservedChannel/addAdmin/',addAdmins);
router.post('/ReservedChannel/delete',deleteCh);

router.get('/nReservedChannel',getChannelsNumber);
router.get('/ReservedChannels',getChannel);


/* Channel Methods*/
router.post('/Channel',createChannel);
router.get('/Channel/list',getChannelList);

module.exports = router;