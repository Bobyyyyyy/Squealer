const frontpageView = (req,res) => {
    res.render("frontpage",{
    });
}

const login = (req,res) => {
    //qui andrà la funzione che quando si preme il tasto login farà il controllo della password e dell'utente nel DB (POST)



    //qui ci sarà una cosa del tipo res.render res.render("homepage")
    res.render("./App/homepage", {

    });
}

module.exports = {
    frontpageView,
    login
};