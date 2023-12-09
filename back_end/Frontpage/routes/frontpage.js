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

/* -------------------- for AppSmm build -------------------- */

const path = require('path');

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


/*------------------------------------------------*/

module.exports = router;