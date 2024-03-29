const startMonth = '0 0 0 1 * *';   //first day of every month at 00:00
const startWeek = '0 0 0 * * 1';    //first day of every week at 00:00
const midnight = '0 0 0 * * *';     //every day at 00:00
const evening = '0 11 * * *'        //every day at 20:00

const cast2millis = {
    'seconds': 1000,
    'minutes': 1000*60,
    'hours': 1000*60*60,
}


let scheduledPostArr = [];
/*
    Scheduled function that runs only 1 time.
 */
let scheduledFnOne = [];

/**
 *
 * @param {Number} time2next
 * @returns {string}    - '* * * * * *'
 */
const getNextTick = (time2next) => {
    let now = new Date();
    let nextTick = new Date(now.getTime() + time2next)
    let cronTime = [
        nextTick.getSeconds().toString(),
        nextTick.getMinutes().toString(),
        nextTick.getHours().toString(),
        nextTick.getDate().toString(),
        (nextTick.getMonth() + 1).toString(),
        nextTick.getDay().toString(),
    ]

    return cronTime.join(' ');
}

module.exports = {
    getNextTick,
    scheduledPostArr,
    cast2millis,
    midnight,
    startWeek,
    startMonth,
    scheduledFnOne,
    evening
}
