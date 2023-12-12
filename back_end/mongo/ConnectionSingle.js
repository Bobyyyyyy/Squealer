const mongoose = require('mongoose');

const dbName = "db";
const mongouri = `mongodb://localhost:27017/${dbName}`;
//const mongouri = mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname};

const connection = () => {
    let singleConnection;
    return {
        get: async () => {
            if(!singleConnection){
                await mongoose.connect(mongouri, {
                    useUnifiedTopology: true,
                    useNewUrlParser: true
                })
                singleConnection = mongoose.connection;
            }
            return singleConnection;
        }
    }
}

module.exports = connection();