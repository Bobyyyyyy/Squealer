const express = require('express');
const {registerView} = require('../controllers/RegisterController');
const {createUser} = require("../controllers/MongoController");
const {homeView} = require("../controllers/App/AppController");

const router = express.Router();
router.get('/',registerView);
module.exports = router;