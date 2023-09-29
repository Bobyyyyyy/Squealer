const mongoose = require('mongoose');
const dbname = "db";
const saltRounds = 10;

const connectdb = async (credentials) => {
    try {
        //const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
        const mongouri = `mongodb://localhost:27017/${dbname}`;
        await mongoose.connect(mongouri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    }
    catch(err){
        return err;
    }
}

module.exports = {
    connectdb,
    saltRounds,
}