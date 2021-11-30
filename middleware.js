//Require Dependencies
const Writing = require("./models/writing");
const Rating = require("./models/rating");

// Requiring this Middleware will in turn require a logged in User to access
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //Store the URL They are Requesting
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in.");
        return res.redirect("/login");
    }
    next();
};

// Requiring this Middleware will in turn require the original author or admin status to access.
module.exports.isAuthor = async (req, res, next) => {
    console.log(req.user.isAdmin);
    const { id } = req.params;
    const writing = await Writing.findById(id);
    if (writing.author.equals(req.user._id) || req.user.isAdmin) next();
    else {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/writings/${id}`);
    }
};

// Requiring this Middleware will in turn require the original rating author or admin status to access.
module.exports.isRatingAuthor = async (req, res, next) => {
    console.log(req.params);
    const { id, ratingId } = req.params;
    const rating = await Rating.findById(ratingId);
    if (rating.author.equals(req.user._id) || req.user.isAdmin) next();
    else {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/writings/${id}`);
    }
};
