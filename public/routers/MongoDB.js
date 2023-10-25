const express = require('express');
const {createUser,createPost, getSessionUser, getAllUsers, getUsersNumber, modifyUser, getVips,
    createReservedChannel, addFollowers, addAdmins, deleteCh
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
router.post('/ReservedChannel',createReservedChannel);
router.post('/ReservedChannel/addFollower/',addFollowers);
router.post('/ReservedChannel/addAdmin/',addAdmins);
router.post('/ReservedChannel/delete',deleteCh);

module.exports = router;