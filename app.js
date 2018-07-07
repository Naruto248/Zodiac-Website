var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    expressSession  = require("express-session"),
    Event           = require("./models/event.js"),
    Comment         = require("./models/comment.js"),
    User            = require("./models/user.js"),
    middleware      = require("./middleware/index.js"),
    seed			= require("./seed.js");
    
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//=============================
// Passport Configuration
//=============================

app.use(expressSession({
    secret: "This is my way of NINJA !",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//=============================
// Other Routes
//=============================

app.get("/", function(req, res){
    Event.find({}, function(err, allEvents){
        if(err){
            console.log(err);
            res.render("pagenotfound.ejs");
        } else {
            res.render("landing.ejs", {events: allEvents});
        }
    });
});

app.post("/events/:id/regs", middleware.isLoggedIn, function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err || !foundEvent){
            console.log(err);
            res.render("pagenotfound.ejs");
        } else {
            for(var i=0; i<foundEvent.regs.length; i++){
                if(foundEvent.regs[i].equals(req.user._id)){
                    req.flash("error", "You are already registered !");
                    return res.redirect("/events/" + req.params.id);
                }
            }
            foundEvent.regs.push(req.user);
            foundEvent.save();
            req.flash("success", "You have been successfuly registered !");
            res.redirect("/events/" + req.params.id);
        }
    });
});

app.get("/events/:id/regs", middleware.isAdmin, function(req, res){
    Event.findById(req.params.id).populate("regs").exec(function(err, foundEvent){
        if(err || !foundEvent){
            console.log(err);
            res.render("pagenotfound.ejs");
        } else {
            res.render("reg.ejs", {event: foundEvent});
        }
    });
});

//=============================
// Events Routes
//=============================

// INDEX - Show all events
app.get("/events", function(req, res){
    Event.find({}, function(err, allEvents){
        if(err){
            console.log(err);
            res.render("pagenotfound.ejs");
        } else {
            res.render("events/index.ejs", {events: allEvents});
        }
    });
});

// NEW - Show form to create event
app.get("/events/new", middleware.isAdmin, function(req, res){
    res.render("events/new.ejs");
});

// CREATE - Add new event to DB
app.post("/events", middleware.isAdmin, function(req, res){
    Event.create(req.body.event, function(err, newlyCreated){
        if(err){
            console.log(err);
            res.render("pagenotfound.ejs");
        } else {
            res.redirect("/events");
        }
    });
});

// SHOW - Show more info about one event
app.get("/events/:id", function(req, res){
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
        if(err || !foundEvent){
            console.log(err);
            res.render("pagenotfound.ejs");
        } else {
            res.render("events/show.ejs", {event: foundEvent});
        }
    });
});

// EDIT - Edit event
app.get("/events/:id/edit", middleware.isAdmin, function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err || !foundEvent){
        	console.log(err);
        	res.render("pagenotfound.ejs");
        } else {
            res.render("events/edit.ejs", {event: foundEvent});
        }
    });
});

// UPDATE - Update Event
app.put("/events/:id", middleware.isAdmin, function(req, res){
    Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedEvent){
        if(err) {
        	console.log(err);
        	res.render("pagenotfound.ejs");
        } else {
            req.flash("success", "Event Updated Successfully");
            res.redirect("/events/" + req.params.id);
        }
    });
});

// DESTROY - Destroy Event
app.delete("/events/:id", middleware.isAdmin, function(req, res){
    Event.findByIdAndRemove(req.params.id, function(err, deletedEvent){
        if(err) {
        	console.log(err);
        	res.render("pagenotfound.ejs");
        } else {
            req.flash("success", "Event Deleted Successfully");
            res.redirect("/events");
        }
    });
});

//==========================
// Comments Routes
//==========================

// CREATE
app.post("/events/:id/comments", middleware.isLoggedIn, function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err || !foundEvent){
        	console.log(err);
        	res.render("pagenotfound.ejs");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save the comment
                    comment.save();
                    foundEvent.comments.push(comment);
                    foundEvent.save();
                    res.redirect("/events/"+ req.params.id);
                }
            });
        }
    });
});

// EDIT
app.get("/events/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
        	console.log(err);
        	res.render("pagenotfound.ejs");
        } else {
            res.render("comments/edit.ejs", {event_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE
app.put("/events/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
        	console.log(err);
        	res.render("pagenotfound.ejs");
        } else {
            req.flash("success", "Comment Edited Successfully");
            res.redirect("/events/" + req.params.id);
        }
    });
});

// DESTROY
app.delete("/events/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
        	console.log(err);
        	res.render("pagenotfound.ejs");
        } else {
            req.flash("success", "Comment Deleted Successfully");
            res.redirect("/events/" + req.params.id);
        }
    });
});

//==========================
// AUTH routes
//==========================

// Show register form
app.get("/register", function(req, res){
    if(req.user){
        req.flash("error", "Logout first !");
        return res.redirect("back");
    }
    res.render("register.ejs");
});

// Handel sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, mobile: req.body.mobile});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/events");
        });
    });
});

// Show login form
app.get("/login", function(req, res){
    if(req.user){
        req.flash("error", "Logout first !");
        return res.redirect("back");
    }
    res.render("login.ejs");
});

// Handel login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/events",
        failureRedirect: "/login",
        failureFlash: 'Incorrect username or password !'
    }), function(req, res){
	
});

// Logout route
app.get("/logout",function(req, res){
    req.flash("success", "See You Again !");
    req.logout();
    res.redirect("/events");
});

app.get("*",function(req, res){
	res.render("pagenotfound.ejs");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Zodiac has started !");
});