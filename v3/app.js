var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

var app = express();

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
       if(err) {
           console.log(err);
       } else {
           res.render('index', {campgrounds: allCampgrounds});
       }
    });
});

app.post('/campgrounds', (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc }
    Campground.create(newCampground, (err, newlyCreated) =>{
       if(err) {
           console.log(err);
       } else {
            res.redirect('/campgrounds');
       }
    });
});

app.get('/campgrounds/new', (req, res) => {
   res.render('new'); 
});

app.get('/campgrounds/:id', (req, res) => {
   Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
      if(err) {
          console.log(err);
      } else {
          res.render('show', {campground: foundCampground});
      }
   });
});

app.listen(process.env.PORT, process.env.IP, () => {
   console.log(`Server start on ${process.env.PORT}`); 
});