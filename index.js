const session = require('express-session');
const MongoStore = require('connect-mongo');
global.rootDir = __dirname; //Salviamo la directory locale
global.startDate = null;



const express = require('express');
const cors = require('cors');
const {dbname} = require("./dbScripts/utils");

let app = express();


app.use(session({
    secret: 'sburo',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017',
        dbName: dbname,
        ttl: 1000*4*64,
        autoRemove: "native",
        stringify: false,
    }),
}));

//https://dev.to/alisinayousofi/why-we-use-appuseexpressjson-in-our-express-web-app-384
app.use(express.urlencoded({ extended: true })); 
//https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors());
// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.enable('trust proxy');
app.set('view engine', 'ejs');

//il sito inizia dando il controllo al router della frontpage
app.use('/', require('./routes/frontpage'));
app.use('/db',require('./routes/MongoDB'));

// avvio di node
app.listen(8000,function() {
    global.startDate = new Date();
    console.log('App listening on port 8000 started' + ' ' + startDate.toLocaleString());
});

