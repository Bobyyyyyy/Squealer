const mongoose = require('mongoose');
const mongojs = require('./mongo');

global.rootDir = __dirname; //Salviamo la directory locale
global.startDate = null;

const express = require('express');
const cors = require('cors');

let app = express();
//https://dev.to/alisinayousofi/why-we-use-appuseexpressjson-in-our-express-web-app-384
app.use(express.urlencoded({ extended: true })); 
//https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors());
// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.enable('trust proxy');
app.set('view engine', 'ejs');


//il sito inizia dando il controllo al router della frontpage
app.use('/', require('./routes/frontpage'));
app.use('/register', require('./routes/register'));
app.use('/homepage',require('./routes/App'))
app.use('/db',require('./routes/MongoDB'));


// avvio di node
app.listen(8000,function() {
    global.startDate = new Date();
    console.log('App listenting on port 8000 started' + ' ' + global.startDate.toLocaleString());
});

