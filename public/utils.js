const mongoose = require('mongoose');
const dbname = "db";
const saltRounds = 10;
const mongoCredentials = {
    user:"site222330",
    pwd: "aiNgaeh5",
    site:"mongo_site222330"
}
const baseQuota = 50;


const quota ={
    daily: baseQuota,
    weekly: baseQuota*6,
    monthly: (baseQuota*6)*4,
}



const connectdb = async (credentials) => {
    try {
        //const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
        const mongouri = `mongodb://localhost:27017/${dbname}`;

            await mongoose.connect(mongouri, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            })
    }
    catch(err){
        console.log(err);
    }

}

module.exports = {
    connectdb,
    saltRounds,
    mongoCredentials,
    dbname,
    quota
}