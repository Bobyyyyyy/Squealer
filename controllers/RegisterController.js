

const registerView = (req, res) => {
    res.render("register", {
    });
}

const registerDB = (req,res) => {
    //Funzione che viene chiamata quando dobbiamo registrare l'utente nel DB (POST)

    console.log("Sto usando registerDB");

    /*if(persona nel database) {
        riportiamo alla home con un messaggio di account già esistente
    
    }
    else {
        devo passare i dati del mio user all'home page cosi' carichera tutti i dati realtivi all'user
        https://stackoverflow.com/questions/26746730/express-js-is-it-possible-to-pass-an-object-to-a-redirect-like-it-is-with-res-r
    }
    */

    res.redirect("/homepage");
}



module.exports =  {
    registerDB,
    registerView
};