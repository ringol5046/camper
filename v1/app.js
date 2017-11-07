var express = require("express");
var app = express();

app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
   var campgrounds = [
        {name: "Salmon Creek", image: "https://farm2.staticflickr.com/1179/1051152631_f8b4ae0a33.jpg"},
        {name: "Granite Hill", image: "https://farm2.staticflickr.com/1084/1331589629_006a8916a2.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg"}
       ]
       
       res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(process.env.PORT, process.env.IP, () => {
   console.log(`Server start on ${process.env.PORT}`); 
});