const express = require('express');
const {registerView,registerDB} = require('../controllers/RegisterController');
const router = express.Router();
router.get('/',registerView);
router.post('/registerUser',registerDB);
module.exports = router;