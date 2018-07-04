var Comment = require("../models/comment.js");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first !");
    res.redirect("/login");
};

middlewareObj.isAdmin = function(req, res, next){
    if(req.isAuthenticated() && req.user.username == "Abhi"){
        return next();
    }
    req.flash("error", "You don't have permission to do that !");
    res.redirect("/events");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment Not Found");
                res.redirect("/events");
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.username == "Abhi"){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that !");
                    res.redirect("/events");
                }
            }
        });
    } else {
        req.flash("error", "Please login first !");
        res.redirect("/events");
    }
}

module.exports = middlewareObj;