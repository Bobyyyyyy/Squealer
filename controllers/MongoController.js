const {addPost} = require('../dbScripts/postMethods');
const {addUser} = require('../dbScripts/userMethods');

const mongoCredentials = {
    user:"site222330",
    pwd: "aiNgaeh5",
    site:"mongo_site222330"
}


const createUser = async (req,res) => {
    let response = await addUser(req.body,mongoCredentials);
    res.render("App/homepage",{response});
}

const createPost = async (req,res) => {
    res.send(await addPost(760,req.body,mongoCredentials));
}

module.exports = {
    createUser,
    createPost
}