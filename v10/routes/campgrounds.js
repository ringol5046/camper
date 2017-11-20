var express = require("express");
var router = express.Router();

var middleware = require("../middleware");
var Campground = require("../models/campground");

router.get('/', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
       if(err) {
           console.log(err);
       } else {
           res.render('campgrounds/index', {campgrounds: allCampgrounds});
       }
    });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author }
    Campground.create(newCampground, (err, newlyCreated) =>{
       if(err) {
           console.log(err);
       } else {
            res.redirect('/campgrounds');
       }
    });
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
   res.render('campgrounds/new'); 
});

router.get('/:id', (req, res) => {
   Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
      if(err) {
          console.log(err);
      } else {
          res.render('campgrounds/show', {campground: foundCampground});
      }
   });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) =>{
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});   
    });
});

router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
       if(err) {
           res.redirect('/campgrounds');
       } else {
           res.redirect('/campgrounds/' + req.params.id);
       }
   });
});

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;