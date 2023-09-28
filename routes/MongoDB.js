const express = require('express');
const {createUser,search,createPost} = require('../controllers/MongoController');
const {homeView} = require("../controllers/AppController");

const router = express.Router();
router.post('/create',createUser);
router.get('/search',search);
router.post('/addPost',createPost);

module.exports = router;