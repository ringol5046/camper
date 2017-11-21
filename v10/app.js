var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authRoutes =require("./routes/index")

var User = require("./models/user")
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

var app = express();

//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v10");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
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

app.use(authRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
   console.log(`Server start on ${process.env.PORT}`); 
});