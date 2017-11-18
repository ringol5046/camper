var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {
            name: "Cloud's Rest 1", 
            image:"https://farm4.staticflickr.com/3433/3395240746_d9bae26a99.jpg",
            description: "blah blah blah"        
        },
        {
            name: "Cloud's Rest 2", 
            image:"https://farm4.staticflickr.com/3547/3423585461_f17f2dcf55.jpg",
            description: "blah blah blah"        
        },
        {
            name: "Cloud's Rest 3", 
            image:"https://farm4.staticflickr.com/3616/3395793750_207a6d4d36.jpg",
            description: "blah blah blah"        
        },
        {
            name: "Cloud's Rest 4", 
            image:"https://farm4.staticflickr.com/3657/3395588514_d176339062.jpg",
            description: "blah blah blah"        
        },
        {
            name: "Cloud's Rest 5", 
            image:"https://farm4.staticflickr.com/3625/3402031764_e7d6323fef.jpg",
            description: "blah blah blah"        
        }
    ]

function seedDB() {
    Campground.remove({}, (err) => {
        if(err) {
            console.log(err)
        }
        console.log("clean up");
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("add a campground");
                    Comment.create(
                        {
                            text: "Yellow Stone",
                            author: "xxxy"
                        }, (err, comment) => {
                            if(err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("new comment");
                            }     
                        }
                    );
                }
            });
        });
    });
}

module.exports = seedDB;