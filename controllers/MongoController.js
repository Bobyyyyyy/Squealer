const mongojs = require('../mongo');


const mongoCredentials = {
    user:"site222330",
    pwd: "aiNgaeh5",
    site:"mongo_site222330"
}


const createUser = async (req,res) => {
    res.send(await mongojs.addUser(req.body,mongoCredentials));
}

const search = async (req,res) => {
    res.send(await mongojs.getUserByEmail(req.query,mongoCredentials))
}


module.exports = {
    createUser,
    search
}