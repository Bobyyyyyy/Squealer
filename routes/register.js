const express = require('express');
const {registerView} = require('../controllers/RegisterController');
const {createUser} = require("../controllers/MongoController");

const router = express.Router();
router.get('/',registerView);
router.post('/registerUser',createUser);
module.exports = router;