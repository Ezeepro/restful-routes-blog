var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose");

// App config
mongoose.connect("mongodb://localhost/restful_app");
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose/model config
var restappSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", restappSchema);


// Restful Routes
app.get('/', (req, res) => {
    res.redirect("/blogs");
});

// Index Route
app.get('/blogs', (req, res) => {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs})
        }
    });
});

// New Route - for new form post
app.get('/blogs/new', (req, res) => {
    res.render("new");
});

// Create Route - to store post to db and redirect
app.post('/blogs', (req, res) => {
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log(err);
            res.render("new");
        } else {
    //redirect
            res.redirect("/blogs");
        }
    });
});

// Show Route - shows the details of one particular blog post
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, function(err, foundblog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundblog});
        }
    });
});


// Update Route
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete Route
app.delete('/blogs/:id', (req, res) => {
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/blogs");
        } else {
            //redirect somewhere
            res.redirect("/blogs");
        }
    });
});










app.listen(3000, () => {
    console.log('App just started and is listening on port 3000!');
});






    


    
