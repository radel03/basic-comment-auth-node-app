var mongoose = require("mongoose");
var Topic = require("./models/topic");
var Comment = require("./models/comment");

var data =[
     {
     topic: "Rocky Mountain",
     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc placerat ipsum vel venenatis interdum. Vivamus sit amet placerat ligula, vel luctus nisl.",
     image: "http://mountain.org/wp-content/uploads/Andes-Mountains.jpg"
     },
     
     {
     topic: "Granite Hill",
     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc placerat ipsum vel venenatis interdum. Vivamus sit amet placerat ligula, vel luctus nisl.",
     image: "http://images.akamai.steamusercontent.com/ugc/25087975291817161/4B01A1274CA990A3577CC37E1DAA72F88DE353F8/"
     },
     
     {
     topic: "Hell Ice",
     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc placerat ipsum vel venenatis interdum. Vivamus sit amet placerat ligula, vel luctus nisl.",
     image: "http://hd-wall-papers.com/images/wallpapers/mountains-wallpaper/mountains-wallpaper-12.jpg"
     },
     
     {
     topic: "Lake Valley",
     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc placerat ipsum vel venenatis interdum. Vivamus sit amet placerat ligula, vel luctus nisl.",
     image: "http://miriadna.com/desctopwalls/images/max/Forest-at-the-mountains.jpg"
     }
];


function seedDB(){
	Topic.remove({}, function(err){
		if(err){
			console.log(err);
		}
		
		console.log("removed topics");
		
		data.forEach(function(seed){
			Topic.create(seed, function(err, topic){
				if(err){
					console.log(err);
				}else{
					console.log("added a new topic");
					//Create a comment
					Comment.create(
					    {
					        text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 
					        author:"Dragon"
					    }, function(err, comment){
						if(err){
							console.log(err);
						}else{
							topic.comments.push(comment);
							topic.save();
							console.log("Created new comment");
						}
					});
				}
			});
		});
		
	});
}


module.exports = seedDB;