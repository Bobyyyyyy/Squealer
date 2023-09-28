const express = require('express');
const {frontpageView,login} = require('../controllers/FrontPageController');
const router = express.Router();
router.get('/',frontpageView);
router.get('/login',login);
router.get('/testpost',async (req,res) => {
        res.render('testpost');
})
module.exports = router;