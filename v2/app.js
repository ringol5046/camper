var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//schema setup
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//     {
//         name:"Granite Hill",
//         image:"https://farm2.staticflickr.com/1084/1331589629_006a8916a2.jpg",
//         description: "This is a huge granite hill, no bathrooms. No water, Beautiful granite!"
//     }, (err, campground) => {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("newly created campground");
//             console.log(campground);
//         }
//     });

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
    // res.render('campgrounds', {campgrounds: campgrounds});
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
   res.render('new.ejs'); 
});

app.get('/campgrounds/:id', (req, res) => {
   Campground.findById(req.params.id, (err, foundCampground) => {
      if(err) {
          console.log(err);
      } else {
          res.render('show.ejs', {campground: foundCampground});
      }
   });
});

app.listen(process.env.PORT, process.env.IP, () => {
   console.log(`Server start on ${process.env.PORT}`); 
});