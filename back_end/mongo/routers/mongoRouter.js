const express = require('express');
const dbRouter = express();

dbRouter.use('/user',require('./userRouter'));
dbRouter.use('/post',require('./postRouter'));
dbRouter.use('/official',require('./officialChannelsRouter'));
dbRouter.use('/channel',require('./channelsRouter'));

module.exports = dbRouter;