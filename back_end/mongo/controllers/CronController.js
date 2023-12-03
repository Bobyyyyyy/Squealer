const nodeCron = require('node-cron')
const UMM = require('../models/userMethods')
const {scheduledFnOne,scheduledPostArr, getNextTick, cast2millis, } = require("./utils");
const {addTimedPost} = require("../models/postMethods");


/**
 *
 * @param {String} frequency - e.g. 6 seconds, 5 days, ...
 * @returns {number} - timestamp - e.g. 100000 ms
 */
const parse2timestamp = (frequency) => {
    let freq = frequency.split(' ');        // ['4' , 'seconds']
    return (cast2millis[freq[1]] * parseInt(freq[0]));
}

/**
 *
 * @param {String} type - ['D','W','M']
 * @returns {Promise<void>}
 */
const resetQuota = async (type) => {
    try{
        //AGGIUNERE CASI DI ERROR
        await UMM.resetQuota(type)

    }catch (err){
        throw err;
    }
}
/**
 *
 * @param {Types.ObjectId} postId
 * @param {String} frequency - Interval, type of time (e.g. 5 seconds, 9 days, ... )
 * @param {String} content  - content of Squeal. Used for parse {NUM}, ...
 * @param {String} typeC - content type. Used for store only text content.
 * @param {Number} squealNumber - number of squeal of scheduled Squeal
 * @returns {Promise<void>}
 */
const createScheduledPost = async (postId, frequency, squealNumber, content, typeC) =>{
    let timestamp = parse2timestamp(frequency);

    let newTimedPost = {
        allTimes: squealNumber,
        done:1,             //first insert done before.
        id : postId,
        ...(typeC === 'text') && {content: content},
        timestamp2next: timestamp,
        job :  nodeCron.schedule(getNextTick(timestamp), async () => await addTimedPost(postId),{
            scheduled: true,
            timezone: 'Europe/Rome',
        })
    }
    scheduledPostArr.push(newTimedPost)
    return {trash: 0};
}

const createMaxQuotaJob = async (timestamp, percentage,user) => {

    // Need ID to select right update to remove. (user can be in array many times)

    let ID = Math.max(scheduledFnOne.map(schedule => schedule.user === user ? schedule.id : 0)) + 1;

    let schedule = {
        user: user,
        id: ID,
        job: nodeCron.schedule(getNextTick(timestamp), async () => {
          await UMM.updateMaxQuota(-percentage,user, ID);
        }, {
            scheduled: true,
            timezone: 'Europe/Rome',
        })
    }
    //TODO: con dizionario implementazinoe più efficiente (chiave il nome utente).
    scheduledFnOne.push(schedule);
}

module.exports =  {
    resetQuota,
    createScheduledPost,
    createMaxQuotaJob
};