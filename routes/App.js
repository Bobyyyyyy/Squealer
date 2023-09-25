const express = require('express');
const {homeView} = require('../controllers/AppController');
const router = express.Router();
router.get('/',homeView); 
module.exports = router;