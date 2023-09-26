const mongoose = require('mongoose');
const UserdbName = "userdb";  
const User = require("./models/User.js");

//in qualche modo si deve collegare all'index, magari facendo routing?

//connessione
exports.createUserDB = async (credentials) => {
    try{
       //const mongoDBuri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}/${dbname}`;
       const mongoDBuri = `mongodb://localhost:27017/${UserdbName}`;
        await mongoose.connect(mongoDBuri,{
            useUnifiedTopology: true, 
            useNewUrlParser: true 
        })
        //debug
        console.log("DB connected");

        await mongoose.connection.close();  //disconnessione
    }
    catch(err){
        console.log(err);
    }
}

//va qui?
//https://stackoverflow.com/questions/70229333/creating-an-instance-in-mongoose

//assumo connessione già aperta
exports.addUser = async (req,res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
        await newUser.save();
        //debug
        res.status(200).json("user saved");
    }
    catch(err){
        console.log(err);
    }
}