var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");

var User = require("./models/user")
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

var app = express();

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

//===========================
// passport setup
//===========================

app.use(require("express-session")({
    secret: 'Esperanza gomesz',
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   next();
});

//===========================
// campground routes
//===========================

app.get('/', (req,res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    
    Campground.find({}, (err, allCampgrounds) => {
       if(err) {
           console.log(err);
       } else {
           res.render('campgrounds/index', {campgrounds: allCampgrounds});
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
   res.render('campgrounds/new'); 
});

app.get('/campgrounds/:id', (req, res) => {
   Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
      if(err) {
          console.log(err);
      } else {
          res.render('campgrounds/show', {campground: foundCampground});
      }
   });
});

//===========================
// comment routes
//===========================

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground})
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
   Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id)
                }
            });
        } 
   }); 
});

//===========================
// auth routes
//===========================

app.get('/register', (req, res) => {
   res.render('auth/register'); 
});

app.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

app.get('/login', (req, res) => {
    res.render('auth/login');
});

app.post('/login', passport.authenticate('local', 
{
    successRedirect: '/campgrounds',
    failureRedirect: 'auth/login'
}), (req, res) => {
});

app.get('/logout', (req, res) => {
   req.logout();
   res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.render('auth/login');
}

app.listen(process.env.PORT, process.env.IP, () => {
   console.log(`Server start on ${process.env.PORT}`); 
});