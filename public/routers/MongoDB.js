const express = require('express');
const {createUser,createPost, getSessionUser, getAllUsers, getUsersNumber, modifyUser, getVips,
    createReservedChannel, deleteCh, getChannelsNumber, getChannel, createChannel, getChannelList, getPosts,
    channel, checkUserInChannel, updateReaction, deleteReaction, getSessionVip, updateSessionVip, getQuota, getFollnPosts, getLastPost, removePost, modifyDesc
} = require('../controllers/MongoController');
const router = express.Router();

/* Session Methods */
router.put('/sessionVip',updateSessionVip);
router.get('/sessionVip', getSessionVip);

/* User Methods */
router.post('/user',createUser,(req,res) => {
    res.redirect('/mod/users');
});
router.put('/user',modifyUser);
router.get('/userid',getSessionUser);
router.get('/nusers',getUsersNumber);
router.get('/users',getAllUsers);
router.get('/getVips',getVips)
router.get('/user/quota',getQuota)
router.get('/user/info',getFollnPosts);
router.get('/user/lastPost',getLastPost);


/* Post Methods */
router.post('/addPost',createPost);
router.post('/deletePost',removePost);
router.get('/posts',getPosts);
router.put('/post/updateReaction', updateReaction);
router.put('/post/deleteReaction', deleteReaction);


/* Reserved Channel Methods*/
router.post('/ReservedChannel',createReservedChannel, (req,res) => {
    res.redirect('/mod/officialChannels');
});
router.get('/ReservedChannel',channel);
router.put('/ReservedChannel',modifyDesc);
router.post('/ReservedChannel/delete',deleteCh);

router.get('/nReservedChannel',getChannelsNumber);
router.get('/ReservedChannels',getChannel);


/* Channel Methods*/
router.post('/Channel',createChannel);
router.get('/Channel/list',getChannelList);
router.get('/channelCheck',checkUserInChannel);

module.exports = router;