

const frontpageView = (req,res) => {
    res.render("frontpage",{
    });
}

const login = (req,res,next) => { 
    //(POST)
    console.log("Sto usando login");

    /*if(persona non nel database) {
        riportiamo alla home con un messaggio di credenziali sbagliate.
    
    }
    else {
        devo passare i dati del mio user all'home page cosi' carichera tutti i dati realtivi all'user
        https://stackoverflow.com/questions/26746730/express-js-is-it-possible-to-pass-an-object-to-a-redirect-like-it-is-with-res-r
    }
    */
    res.redirect('/homepage');
}



module.exports = {
    frontpageView,
    login
};