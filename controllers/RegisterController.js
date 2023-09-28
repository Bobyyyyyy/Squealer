

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
    res.render('App/homepage',{result});
}


const esempio = async (req,res) => {
        const user = {
            name: 'Alessandro',
            surname: 'Tomaiuolo',
            age: '21'
        };
        res.render('App/homepage', {user});
}


module.exports = {
    registerDB,
    registerView,
    esempio
};