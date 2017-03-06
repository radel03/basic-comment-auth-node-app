var express = require("express");
var router = express.Router();
var Topic = require("../models/topic");
var Comment = require("../models/comment");
var middleware = require("../middleware");

/////////////////////COMMENT ROUTES

//comments new
router.get("/topics/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Topic.findById(req.params.id, function(err, selectedTopic){
       if(err){
           console.log(err);
       } else {
           console.log(req.params.id);
           res.render("comments/new", {topic: selectedTopic});
       }
    });
});

//comments create
router.post("/topics/:id/comments", middleware.isLoggedIn, function(req, res){
   Topic.findById(req.params.id, function(err, topic){
       if(err){
           req.flash("error", "Something went wrong");
           res.redirect("/topics");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               topic.comments.push(comment);
               topic.save();
               req.flash("success", "Comment added");
               res.redirect("/topics/" + topic._id);
           }
        });
       }
   });
});

//comments edit
router.get("/topics/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
           res.render("comments/edit", {topic_id: req.params.id, comment: foundComment});
       }
    });
});

//comments update 
router.put("/topics/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          req.flash("success", "Comment updated");
          res.redirect("/topics/" + req.params.id);
      }
   });
});

//comments destroy
router.delete("/topics/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      } else {
          req.flash("success", "Comment deleted");
          res.redirect("/topics/" + req.params.id);
      }
   });
});

module.exports = router;