const {mongoCredentials} = require("../models/utils");
const nodeCron = require('node-cron')
const UMM = require('../models/userMethods')
const PMM = require('../models/postMethods')
/* uso solo ID nell'array, per efficienza ( - dimensione array, + richieste al DB )*/
let scheduledPostArr = []

const resetMtimeout = '0 0 0 1 * *';    //first day of every month at 00:00
const resetWtimeout = '0 0 0 * * 1';    //first day of every week at 00:00
const resetDtimeout = '0 0 0 * * *';    //every day at 00:00

/**
 *
 * @param {String} frequency - e.g. 6 seconds, 5 days, ...
 * @returns {string} - '* * * * * *', Cron Schedule
 */
const parseCronTime = (frequency) => {
    let freq = frequency.split(' ');        // ['4' , 'seconds']
    let cronTime = ['*','*','*','*','*','*'];        //every seconds
    switch (freq[1]){
        case 'seconds':
            cronTime[0] = [cronTime[0], freq[0]].join('/');      //['*/4'] --> ogni 4 secondi
            break;
        case 'minutes':
            cronTime[0] = '0';
            cronTime[1] = [cronTime[1], freq[0]].join('/');
            break;
        case 'hours':
            cronTime[0] = '0';
            cronTime[1] = '0';
            cronTime[2] = [cronTime[2], freq[0]].join('/');
            break;
        case 'days':
            cronTime[0] = '0';
            cronTime[1] = '0';
            cronTime[2] = '0';
            cronTime[3] = [cronTime[3], freq[0]].join('/');
            break;
    }
    return cronTime.join(' ')
}

/**
 *
 * @param {String} type - ['D','W','M']
 * @returns {Promise<void>}
 */
const resetQuota = async (type) => {
    try{
        //AGGIUNERE CASI DI ERROR
        await UMM.resetQuota(type,mongoCredentials)

    }catch (err){
        throw err;
    }
}
/**
 *
 * @param {ObjectId} postId
 * @param {String} frequency - Interval, type of time (e.g. 5 seconds, 9 days, ... )
 * @param {String} content  - content of Squeal. Used for parse {NUM}, ...
 * @param {String} typeC - content type. Used for store only text content.
 * @param {Number} squealNumber - number of squeal of scheduled Squeal
 * @returns {Promise<void>}
 */
const createScheduledPost = async (postId, frequency, squealNumber, content, typeC) =>{
    let newTimedPost = {
        job : nodeCron.schedule(parseCronTime(frequency), async () => await PMM.addTimedPost(postId, scheduledPostArr, mongoCredentials), {scheduled: false}),
        allTimes: squealNumber,
        done:1,             //first insert done before.
        id : postId,
        ...(typeC === 'text') && {content: content},
    }
    scheduledPostArr.push(newTimedPost)
    newTimedPost.job.start();
    return {trash: 0};
}

module.exports =  {
    resetWtimeout,
    resetMtimeout,
    resetDtimeout,
    resetQuota,
    createScheduledPost,
    scheduledPostArr
};