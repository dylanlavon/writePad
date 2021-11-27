const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isRatingAuthor } = require("../middleware");
const ratings = require("../controllers/ratings");

router.post("/", ratings.createRating);

// Remove reference to rating in campground, and the rating itself.
router.delete("/:ratingId", isLoggedIn, isRatingAuthor, ratings.deleteRating);

// Export Routes
module.exports = router;
