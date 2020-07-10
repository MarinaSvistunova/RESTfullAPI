const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;


const app = express();
const jsonParser = express.json();


const session = require("express-session")
const bodyParser = require("body-parser");
const passport = require("passport");


const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

let dbClient;

app.use(express.static(__dirname + "/public"));
app.use(session({ secret: "supersecret" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("usersdb").collection("users");
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

 // const collection = req.app.locals.collection;

 const LocalStrategy = require("passport-local").Strategy;
 passport.use(new LocalStrategy((username, password, done)=>{ 
   findUser(username,(err, user)=>{
 if (err) {
                 return done(err);
             }
 if (!user) {
                 return done(null, false);
             }
 if (password !== user.password ) {
                 return done(null, false);
             }
             return done(null, user);
         })
 } ));

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
