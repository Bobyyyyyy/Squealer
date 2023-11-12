const session = require('express-session');
const es6Renderer = require('express-es6-template-engine');

const MongoStore = require('connect-mongo');
global.rootDir = __dirname; //Salviamo la directory locale
global.frontViews = __dirname + "/Frontpage/views"
global.startDate = null;

const express = require('express');
const cors = require('cors');
const {dbname} = require("./back_end/mongo/models/utils");
const {isSMM} = require("./back_end/Frontpage/controllers/FrontPageController");

const storeSession = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017',
    dbName: dbname,
    clear_interval: 660,
    ttl: 600,
    stringify: false,
})

let app = express();

app.use(express.json({limit:'30mb'}));

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
app.set('views', [__dirname + '/back_end/AppMod/views', __dirname+ '/back_end/Frontpage/views']);
app.set('view engine','html');

//il sito inizia dando il controllo al router della frontpage
app.use('/', require('./back_end/Frontpage/routes/frontpage'));
app.use('/db',require('./back_end/mongo/routers/mongoRouter'));
app.get(['/SMM','/SMM/*'], isSMM, (req,res) => {
    res.sendFile(rootDir + '/front_end/AppSmm/index.html');
})

app.get(['/user','/user/*',],(req,res) => {
    res.sendFile(rootDir + '/front_end/AppUser/index.html');
})

app.use('/js' ,express.static(rootDir + '/front_end/AppMod/src/js'));
app.use('/css',express.static(rootDir + '/front_end/AppMod/src/css'));
app.use('/img',express.static(rootDir + '/back_end/assets/img'))
app.use('/icons/reactionIcons',express.static(rootDir + '/back_end/assets/icons/reactionIcons'))
app.use('/icons/navbarIcons',express.static(rootDir + '/back_end/assets/icons/navbarIcons'))
app.use('/icons/settingsIcons',express.static(rootDir + '/back_end/assets/icons/settingsIcons'))

/* CRON */
const nodeCron =require('node-cron')
const CC = require('./back_end/mongo/controllers/CronController')

// quota reset
nodeCron.schedule(CC.resetDtimeout, async () => {await CC.resetQuota('D')}).start()
nodeCron.schedule(CC.resetWtimeout, async () => {await CC.resetQuota('W')}).start()
nodeCron.schedule(CC.resetMtimeout, async () => {await CC.resetQuota('M')}).start()



// avvio di node
app.listen(8000,function() {
    global.startDate = new Date();
    console.log('App listening on port 8000 started' + ' ' + startDate.toLocaleString());
});

