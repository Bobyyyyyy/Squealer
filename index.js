global.rootDir = __dirname; //Salviamo la directory locale
global.startDate = null;

const express = require('express');
const cors = require('cors');


let app = express();

//https://dev.to/alisinayousofi/why-we-use-appuseexpressjson-in-our-express-web-app-384
app.use(express.urlencoded({ extended: true })); 
app.use('/docs',express.static(global.rootDir + 'public/html'));
//https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors());

// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.enable('trust proxy');

//Mandiamo la pagina index quando accederemo al sito site222330/
app.get('/', async function (req,res) {
    res.sendFile('index.html', {root: global.rootDir + '/docs'});
});

//error.html sarà la pagina mostrata quando tenteremo ad accedere ad un uri diverso.
app.get('*', async function (req,res) {
    res.sendFile('error.html', {root: global.rootDir + '/docs'});
});


// avvio di node
app.listen(8000,function() {
    global.startDate = new Date();
    console.log('App listenting on port 8000 started $(global.startDate.toLocaleString()}');
});