const mongojs = require('../mongo');


const mongoCredentials = {
    user:"site222330",
    pwd: "aiNgaeh5",
    site:"mongo_site222330"
}


const createUser = async (req,res) => {
    let response = await mongojs.addUser(req.body,mongoCredentials);
    res.render("App/homepage",{response});
}

const search = async (req,res) => {
    res.send(await mongojs.getUserByEmail(req.query,mongoCredentials))
}

const createPost = async (req,res) => {
    res.send(await mongojs.addPost(760,req.body,mongoCredentials));
}

module.exports = {
    createUser,
    search,
    createPost
}