const {mongoCredentials} = require("../models/utils");
const UMM = require('../models/userMethods')

const resetMtimeout = '0 0 0 1 * *';    //first day of every month at 00:00
const resetWtimeout = '0 0 0 * * 1';    //first day of every week at 00:00
const resetDtimeout = '0 0 0 * * *';    //every day at 00:00


/**
 *
 * @param {String} type - ['D','W','M']
 * @returns {Promise<void>}
 */
const resetQuota = async (type) => {
    console.log("tick --> " + type)
    try{
        //AGGIUNERE CASI DI ERROR
        await UMM.resetQuota(type,mongoCredentials)

    }catch (err){
        throw err;
    }
}

module.exports =  {
    resetWtimeout,
    resetMtimeout,
    resetDtimeout,
    resetQuota,
};