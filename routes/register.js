const express = require('express');
const {registerView,registerDB} = require('../controllers/RegisterController');
const router = express.Router();
router.get('/',registerView); //per tornare alla frontpage
router.get('/registerUser',registerDB);
module.exports = router;