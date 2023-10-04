const express = require('express');
const {createUser,search,createPost} = require('../controllers/MongoController');
const router = express.Router();
router.post('/create',createUser);
router.post('/addPost',createPost);
module.exports = router;