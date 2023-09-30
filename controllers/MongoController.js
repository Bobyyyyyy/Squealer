const {addPost} = require('../dbScripts/postMethods');
const {addUser, loginUser, searchByUsername, changePwsd} = require('../dbScripts/userMethods');

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

const login  = async (req,res) => {
    try {
        let response = await loginUser(req.body,mongoCredentials);
        res.redirect('/');

    }
    catch (Error) {
        res.redirect('/register');
    }
}

const searchUser = async (req,res) => {
    res.send(await searchByUsername(req.body,mongoCredentials));
}

const changePassword = async (req,res) => {
    res.send(await changePwsd(req.body,mongoCredentials));
}

module.exports = {
    createUser,
    createPost,
    searchUser,
    changePassword,
    login
}