const mongoose = require('mongoose');
const dbname = "db";
const saltRounds = 10;
const mongoCredentials = {
    user:"site222330",
    pwd: "aiNgaeh5",
    site:"mongo_site222330"
}

const CRITICAL_MASS_MULTIPLIER = 0.25;


/* Characters Quota */
const baseQuota = 250;
const quota ={
    daily: baseQuota,
    weekly: baseQuota*6,
    monthly: (baseQuota*6)*4,
}



function createError (message,statusCodeError){
    let err = new Error(message);
    err.statusCode = statusCodeError;
    err.mes = message
    return err;
}

const find_remove = (arr,id) => {
    let index = arr.findIndex(obj => obj['id'] === id);
    let el2ret = arr[index];
    arr.splice(index,1);
    return el2ret;
}


module.exports = {
    CRITICAL_MASS_MULTIPLIER,
    saltRounds,
    mongoCredentials,
    dbname,
    quota,
    createError,
    find_remove,
}