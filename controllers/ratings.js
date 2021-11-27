// Require dependencies
const Writing = require("../models/writing");
const Rating = require("../models/rating");

// Creates a new rating and saves it to MongoDB Redirects to the new writing's show page.
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

// Deletes a specific Rating. Flashes a success message, then redirects to the Writing's show page.
module.exports.deleteRating = async (req, res) => {
    const { id, ratingId: ratingId } = req.params;
    await Writing.findByIdAndUpdate(id, { $pull: { ratings: ratingId } });
    await Rating.findByIdAndDelete(ratingId);
    req.flash("success", "Successfully deleted rating.");
    res.redirect(`/writings/${id}`);
};
