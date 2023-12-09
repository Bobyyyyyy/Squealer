const session = require('express-session');
const es6Renderer = require('express-es6-template-engine');

const MongoStore = require('connect-mongo');
global.rootDir = __dirname; //Salviamo la directory locale
global.frontViews = __dirname + "/Frontpage/views"
global.startDate = null;

const express = require('express');
const cors = require('cors');
const {dbname, mongoCredentials} = require("./back_end/mongo/models/utils");
const mongoose = require('mongoose');
const path = require('path');
const {isUser} = require("./back_end/Frontpage/controllers/FrontPageController");

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


app.get(['/user','/user/*'], isUser, (req,res) => {
    res.sendFile(rootDir + '/front_end/AppUser/index.html');
})

app.use('/js' ,express.static(rootDir + '/front_end/AppMod/src/js'));
app.use('/css',express.static(rootDir + '/front_end/AppMod/src/css'));
app.use('/icons/reactionIcons',express.static(rootDir + '/back_end/assets/icons/reactionIcons'))
app.use('/icons/navbarIcons',express.static(rootDir + '/back_end/assets/icons/navbarIcons'))
app.use('/icons/settingsIcons',express.static(rootDir + '/back_end/assets/icons/settingsIcons'))
app.use('/img',express.static(rootDir + '/public/img'))
app.use('/scss',express.static(rootDir + '/public/assets'))



/* CRON */
const nodeCron = require('node-cron')
const CC = require('./back_end/mongo/controllers/CronController')
const cronTabs = require("./back_end/mongo/controllers/utils");
const {logout} = require("./back_end/Frontpage/controllers/FrontPageController");

// quota reset
nodeCron.schedule(cronTabs.midnight, async () => {await CC.resetQuota('D')}).start()
nodeCron.schedule(cronTabs.startWeek, async () => {await CC.resetQuota('W')}).start()
nodeCron.schedule(cronTabs.startMonth, async () => {await CC.resetQuota('M')}).start()

//Post Automatici canali ufficiali
const yesterday = () => {
    let today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toJSON().slice(0,10);
}
// DA SISTEMARE.
const API_NEWS_KEY = 'fb2d6c9f8a7b402e9410221202ad11d6';
const API_TOP_NEWS = `https://newsapi.org/v2/everything?from=${yesterday()}&sortBy=popularity&apiKey=${API_NEWS_KEY}&pageSize=1`
const API_NASA = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'

nodeCron.schedule(cronTabs.evening, async () => {await CC.createOfficialScheduledPost('TOP_NEWS', API_TOP_NEWS)}).start();
nodeCron.schedule(cronTabs.evening, async () => {await CC.createOfficialScheduledPost('NASA_APOD',API_NASA)}).start()


// avvio di node
app.listen(8000,async function() {

    global.startDate = new Date();
    console.log('App listening on port 8000 started' + ' ' + startDate.toLocaleString());

});