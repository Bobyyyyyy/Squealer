const express = require('express');
const {createUser,search} = require('../controllers/MongoController');
const {homeView} = require("../controllers/AppController");
const router = express.Router();
router.post('/create',createUser);
router.get('/search',search);

module.exports = router;