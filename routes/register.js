const express = require('express');
const {frontpageView} = require('../controllers/FrontPageController');
const {registerView,registerDB} = require('../controllers/RegisterController');


const router = express.Router();
router.get('/register',registerView); //pagina caricata appena il sito viene caricaato
router.get('/homepage', registerDB); //associare al bottone l'uri /register cosi' verrà renderizzata la pagina di register (in realtà è un POST, è un GET solo per testare)
router.get('/',frontpageView) //per tornare alla frontpage
module.exports = router;