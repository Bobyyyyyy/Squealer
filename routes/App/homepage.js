const express = require('express');
const {homeView} = require('../../controllers/App/AppController');
const router = express.Router();
router.get('/',homeView); 
module.exports = router;