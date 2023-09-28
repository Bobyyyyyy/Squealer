const express = require('express');
const {registerView,registerDB, esempio} = require('../controllers/RegisterController');
const router = express.Router();
router.get('/',registerView);
router.post('/registerUser',registerDB);
router.get('/test',esempio);
module.exports = router;