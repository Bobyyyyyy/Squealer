const express = require('express');
const {frontpageView,login} = require('../controllers/FrontPageController');

const router = express.Router();
router.get('/',frontpageView); //pagina caricata appena il sito viene caricaato
router.get('/register', require('./register')); //il get a register passerà il controllo al router di register
router.get('/homepage',login) //la funzione login da realizzare permetterà il controllo della password e manderà alla home (in realtà è un POST, è un GET solo per testare)
module.exports = router;