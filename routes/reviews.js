const express = require('express')
const router = express.Router({mergeParams: true});
const Story = require('../models/story')
const Review = require('../models/review')

router.post('/', async (req, res) =>{
    const story = await Story.findById(req.params.id);
    const review = new Review(req.body.review)
    story.reviews.push(review);
    await review.save()
    await story.save()
    req.flash('success', 'Created new review.')
    res.redirect(`/stories/${story._id}`)
})

// Remove reference to review in campground, and the review itself.
router.delete('/:reviewId', async (req, res)=>{
    const {id, reviewId} = req.params;
    await Story.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review.')
    res.redirect(`/stories/${id}`)
})

module.exports = router;