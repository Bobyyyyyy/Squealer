const express = require('express');
const {frontpageView, login} = require('../controllers/FrontPageController');
const router = express.Router();
router.get('/',frontpageView);
router.post('/login',login);
module.exports = router;