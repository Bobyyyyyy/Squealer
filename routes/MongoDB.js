const express = require('express');
const {createUser,search,createPost} = require('../controllers/MongoController');
const {createSession} = require("../controllers/FrontPageController");
const router = express.Router();
router.post('/create',createUser,createSession);
router.post('/addPost',createPost);
module.exports = router;