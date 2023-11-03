const session = require('express-session');
const es6Renderer = require('express-es6-template-engine');

const MongoStore = require('connect-mongo');
global.rootDir = __dirname; //Salviamo la directory locale
global.frontViews = __dirname + "/Frontpage/views"
global.startDate = null;


const express = require('express');
const cors = require('cors');
const {dbname} = require("./public/scripts/utils");
const {isSMM} = require("./Frontpage/controllers/FrontPageController");

const storeSession = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017',
    dbName: dbname,
    clear_interval: 660,
    ttl: 600,
    stringify: false,
})

let app = express();

app.use(express.json());

app.use(session({
    secret: 'sburo',
    resave: false,
    saveUninitialized: false,
    store: storeSession,
}));

//https://dev.to/alisinayousofi/why-we-use-appuseexpressjson-in-our-express-web-app-384
app.use(express.urlencoded({ extended: true })); 
//https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors());
// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.enable('trust proxy');

app.engine('html', es6Renderer);
app.set('views', [__dirname + '/AppMod/public/html', __dirname+ '/Frontpage/views', __dirname + '/AppUser/views']);
app.set('view engine','html');

//il sito inizia dando il controllo al router della frontpage
app.use('/', require('./Frontpage/routes/frontpage'));
app.use('/db',require('./public/routers/MongoDB'));
app.get(['/SMM','/SMM/*'], isSMM, (req,res) => {
    res.sendFile(rootDir + '/AppSmm/index.html');
})

app.use('/js' ,express.static(rootDir + '/AppMod/public/js'));
app.use('/css',express.static(rootDir + '/AppMod/public/css'));
app.use('/img',express.static(rootDir + '/public/img'));

// avvio di node
app.listen(8000,function() {
    global.startDate = new Date();
    console.log('App listening on port 8000 started' + ' ' + startDate.toLocaleString());
});

