const express = require('express');
const {homeView,logout} = require('../../controllers/App/AppController');
const router = express.Router();
router.get('/',homeView);
router.get('/logout',logout);
module.exports = router;