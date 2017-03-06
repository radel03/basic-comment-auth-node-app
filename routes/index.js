var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//root
router.get("/", function(req, res){
   res.redirect("/topics");
});

/////////////////////AUTH ROUTES

//auth register new
router.get("/register", function(req, res){
    res.render("register");
});

//auth register register
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
               req.flash("success", "Succesfully registered");
               res.redirect("/topics");
            });
        }
    });
});

//auth login new
router.get("/login", function(req, res){
    res.render("login");
});

//auth login login
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/successmsg",
        failureRedirect: "/failuremsg"
    }), function(req, res){
});

//intermediate login routes for flash msgs
router.get("/successmsg", function(req, res){
    req.flash("success", "Logged in");
    res.redirect("/topics"); 
});

router.get("/failuremsg", function(req, res){
    req.flash("error", "Could not log you in. Please verify your username and password, or make sure you are a registered user before proceeding.");
    res.redirect("/login"); 
});

//auth logout
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged out");
   res.redirect("/topics");
});

module.exports = router;