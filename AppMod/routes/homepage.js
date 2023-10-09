const express = require('express');
const {dashboard} = require('../controllers/ModController');
const router = express.Router();
router.get('/',dashboard);
module.exports = router;