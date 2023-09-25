

const registerView = (req, res) => {
    res.render("register", {
    });
}

const registerDB = (req,res) => {
    //Funzione che viene chiamata quando dobbiamo registrare l'utente nel DB (POST)


    //alla fine ci sarà una cosa del tipo res.render("homepage")
    res.render("./App/homepage", {

    });
}

module.exports =  {
    registerDB,
    registerView
};