const express = require('express');
const {frontpageView,login} = require('../controllers/FrontPageController');
const router = express.Router();
router.get('/',frontpageView); //pagina caricata appena il sito viene caricaatonzione login da realizzare permetterà il controllo della password e manderà alla home (in realtà è un POST, è un GET solo per testare)
router.get('/login',login);
module.exports = router;