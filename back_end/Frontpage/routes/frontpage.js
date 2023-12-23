const express = require('express')
const frontPageController = require('../controllers/FrontPageController');
const userController = require('../../mongo/controllers/userController');
const router = express.Router();
const {isSMM} = require("../../Frontpage/controllers/FrontPageController");

router.get('/',frontPageController.isSessionActive,frontPageController.frontpageView);
router.post('/login',frontPageController.login,frontPageController.createSession);
router.get('/register',frontPageController.isSessionActive,frontPageController.registerView);
router.post('/register',userController.addUser,frontPageController.createSession);
router.use('/mod',frontPageController.isMod,require('../../AppMod/routes/homepage'));
router.get('/logout',frontPageController.logout);

const path = require('path');
const {isUser} = require("../controllers/FrontPageController");

/* -------------------- for AppSmm build -------------------- */


const vueDir = path.join(rootDir ,'front_end','AppSmm','dist_vue/');

if(process.env.NODE_ENV === 'production') {
    router.use(express.static(vueDir));
    router.get(['/assets_vue*','/assets_vue/', '/AppSmm*'], isSMM, async (req,res) => {
        router.use(express.static(vueDir));
        res.render(vueDir + 'index.html');
    })
}
else {
    router.get(['/AppSmm/','/AppSmm/*'], isSMM, async(req,res) => {
        res.render(rootDir + '/front_end/AppSmm/index.html')
    })
}


/* -------------------- for AppUser build -------------------- */


const reactDir = path.join(rootDir ,'front_end','AppUser','dist_react/');

if(process.env.NODE_ENV === 'production') {
    router.use(express.static(reactDir));
    router.get(['/assets_react*','/assets_react/', '/user*'], isUser, async (req,res) => {
        router.use(express.static(reactDir));
        res.render(reactDir + 'index.html');
    })
}
else {
    router.get(['/user/','/user/*'], isUser, async(req,res) => {
        res.render(rootDir + '/front_end/AppUser/index.html')
    })
}


/*------------------------------------------------*/

module.exports = router;