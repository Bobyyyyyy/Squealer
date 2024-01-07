const mongoose = require('mongoose');
const {mongoCredentials} = require("./models/utils");
const dbname = "db";
const mongouri = `mongodb://${mongoCredentials.user}:${mongoCredentials.pwd}@${mongoCredentials.site}/${dbname}?authSource=admin&writeConcern=majority`;
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