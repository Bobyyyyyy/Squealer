const express = require('express');
const {homeView} = require('../controllers/AppController');
const router = express.Router();
router.get('/',homeView); //pagina caricata appena il sito viene caricaatonzione login da realizzare permetterà il controllo della password e manderà alla home (in realtà è un POST, è un GET solo per testare)
module.exports = router;