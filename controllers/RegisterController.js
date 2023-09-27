

const registerView = (req, res) => {
    res.render("register", {
    });
}

const registerDB = async (req,res) => {
    let response = await fetch ('db/create',{
        method:'POST',
        body: req.body
    });
    let result = await response.json();
    res.render('/homepage',{result});
}

module.exports = {
    registerDB,
    registerView
};