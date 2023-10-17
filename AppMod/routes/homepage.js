const express = require('express');
const {dashboard, dashboardJs} = require('../controllers/ModController');
const router = express.Router();
router.get('/',dashboard);
module.exports = router;