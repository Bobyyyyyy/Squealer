const {loginUser} = require("../dbScripts/userMethods");
const {mongoCredentials} = require("../dbScripts/utils");


const frontpageView = (req,res) => {
    if(req.session.authenticated) {
        res.redirect('/homepage');
    }
    else {
        res.render("frontpage",{
    });
    }
}

const login  = async (req,res) => {
    try {
        let response = await loginUser(req.body, mongoCredentials);
        req.session.regenerate(function () {
            req.session.authenticated = true;
            req.session.user = response.username;
            console.log(response);
            console.log(req.session);
            req.session.save();
            res.redirect('/homepage');
        });
    } catch (Error) {
        res.redirect('/register');
    }
}


module.exports = {
    frontpageView,
    login,
};