const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const md5 = require('md5');
const app = express();
const bcrypt = require('bcrypt');

app.set('view engine','ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render('home');
});

app.get("/login", function(req, res){
    res.render("login");
})

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const email = req.body.username
    
    bcrypt.hash(req.body.password, 10, function(err, hash){
        const newUser = new User({
            email: email,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });
});

app.post("/login", function(req, res){
    const email = req.body.username
    const password = req.body.password

    User.findOne({email : email}, function(err, foundResults){
        if(err){
            console.log(err);
        }else{
            if(foundResults){
                bcrypt.compare(password, foundResults.password, function(err, result){
                    if(result === true){
                        res.render("secrets");
                    }
                });
            }
        }
    });

});

app.listen(process.env.PORT || 3000, function(){
    console.log("server started on port 3000")
});