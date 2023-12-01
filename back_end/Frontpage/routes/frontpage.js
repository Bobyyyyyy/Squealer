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

/* -------------------- FOR SMM BUILD -------------------- */
const fs = require('fs/promises');
const path = require('path');
const environment = process.env.NODE_ENV;

const parseManifest = async () => {
    if(environment !== 'production') return {};

    const manifestPath = path.join(rootDir,"front_end","SMM","manifest.json")
    const manifestFile = await fs.readFile(manifestPath);

    return JSON.parse(manifestFile)
}
router.get(['/SMM/','/SMM/*'], isSMM, async(req,res) => {
    const data = {
        environment,
        manifest: await parseManifest(),
    }
    res.render(rootDir + '/front_end/SMM/index.html.ejs', data)
})

/*------------------------------------------------*/

module.exports = router;