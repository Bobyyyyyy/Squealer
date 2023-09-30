const express = require('express');
const {frontpageView} = require('../controllers/FrontPageController');
const {login} = require("../controllers/MongoController");
const {homeView} = require("../controllers/App/AppController");
const router = express.Router();
router.get('/',frontpageView);
router.post('/login',login);
router.get('/testpost',async (req,res) => {
        res.render('testpost');
})

module.exports = router;