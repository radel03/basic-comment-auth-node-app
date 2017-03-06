var express = require("express");
var router = express.Router();
var Topic = require("../models/topic");
var middleware = require("../middleware");

/////////////////////TOPICS ROUTES

//topics index
router.get("/topics", function(req, res){
    Topic.find({}, function(err, alltopics){
        if(err){
            console.log(err);    
        } else {
            res.render("topics/index", {topics: alltopics});
        }
    });
});

//topics new
router.get("/topics/new", middleware.isLoggedIn, function(req, res){
    res.render("topics/new.ejs");
});

//topics create
router.post("/topics", middleware.isLoggedIn, function(req, res){
    var topic = req.body.topic;
    var text = req.body.text;
    var image = req.body.image;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newTopic = {topic: topic, text: text, image: image, author: author};
    Topic.create(newTopic, function(err, newTopic){
       if(err){
           console.log(err);
       } else {
           req.flash("success", "Topic Created");
           res.redirect("/topics");
       }
    });
});

//topics show
router.get("/topics/:id", function(req, res){
    Topic.findById(req.params.id).populate("comments").exec(function(err, foundTopic){
        if(err){
            console.log(err);
        } else {
            res.render("topics/show", {topic: foundTopic});
        }
    });
});

//topics edit
router.get("/topics/:id/edit", middleware.checkTopicOwnership, function(req, res){
    Topic.findById(req.params.id, function(err, foundTopic){
        if(err){
            console.log(err);  ////////Extra error, ignore.
        } else {
            res.render("topics/edit", {topic: foundTopic});   
        }
    });
});


//topics update
router.put("/topics/:id", middleware.checkTopicOwnership, function(req, res){
   Topic.findByIdAndUpdate(req.params.id, req.body.topic, function(err, updatedTopic){
      if(err){
          res.redirect("/topics");
      } else {
          req.flash("success", "Topic Updated");
          res.redirect("/topics/" + req.params.id);
      }
   });
});

//topics destroy
router.delete("/topics/:id", middleware.checkTopicOwnership, function(req, res){
   Topic.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/topics");
      } else {
          req.flash("success", "Topic Deleted");
          res.redirect("/topics");
      }
   });
});


module.exports = router;