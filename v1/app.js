var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgrounds = [
    {name: "Salmon Creek", image: "https://farm2.staticflickr.com/1179/1051152631_f8b4ae0a33.jpg"},
    {name: "Granite Hill", image: "https://farm2.staticflickr.com/1084/1331589629_006a8916a2.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg"}
];

app.get('/', (req,res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
   res.render('new.ejs'); 
});

app.listen(process.env.PORT, process.env.IP, () => {
   console.log(`Server start on ${process.env.PORT}`); 
});