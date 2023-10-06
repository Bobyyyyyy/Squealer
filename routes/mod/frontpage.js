const express = require('express');
const {frontView} = require('../../controllers/mod/ModController');
const router = express.Router();
router.get('/',frontView);
module.exports = router;