var Topic = require("../models/topic");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to login first");
    res.redirect("/login");
};

middlewareObj.checkTopicOwnership = function(req, res, next){
   if(req.isAuthenticated()){
        Topic.findById(req.params.id, function(err, foundTopic){
              if(err){
                  req.flash("error", "Topic not found");
                  res.redirect("back");
              } else {
                  if(foundTopic.author.id.equals(req.user._id)){
                        next();
                  } else {
                        req.flash("error", "Permission denied");
                        res.redirect("back");
                  }
              }
        });
    } else {
        req.flash("error", "You need to login first");
        res.redirect("back");
    } 
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
              if(err){
                  res.redirect("back");
              } else {
                  if(foundComment.author.id.equals(req.user._id)){
                        next();
                  } else {
                        req.flash("error", "Permission denied");
                        res.redirect("back");
                  }
              }
        });
    } else {
        req.flash("error", "You need to login first");
        res.redirect("back");
    }
};

module.exports = middlewareObj;