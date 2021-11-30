// Require the Writing and Rating models
const Writing = require("../models/writing");
const Rating = require("../models/rating");

// The createRating function creates a new rating and saves it to MongoDB. It then redirects the user to the new Writing's show page.
// Additionally, the createRating function is set as an asynchronous function in order to handle the asynchronous calls to MongoDB.
module.exports.createRating = async (req, res) => {
    const writing = await Writing.findById(req.params.id);
    const rating = new Rating(req.body.rating);
    rating.author = req.user._id;
    writing.ratings.push(rating);
    await rating.save();
    await writing.save();
    req.flash("success", "Created new rating.");
    res.redirect(`/writings/${writing._id}`);
};

// The deleteRating function deletes a specific Rating, displays a success message, then redirects to the associated Writing's show page.
// Additionally, the deleteRating function is set as an asynchronous function in order to handle the asynchronous calls to MongoDB.
module.exports.deleteRating = async (req, res) => {
    // The following line is an object destructuring assignment (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
    // It simply declares the variables id and ratingId and sets them equal to the value of req.params.id and req.params.ratingId
    const { id, ratingId } = req.params;
    await Writing.findByIdAndUpdate(id, { $pull: { ratings: ratingId } });
    await Rating.findByIdAndDelete(ratingId);
    req.flash("success", "Successfully deleted rating.");
    res.redirect(`/writings/${id}`);
};
