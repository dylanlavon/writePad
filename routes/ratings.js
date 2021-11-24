const express = require('express')
const router = express.Router({mergeParams: true});
const Writing = require('../models/writing')
const Rating = require('../models/rating')

router.post('/', async (req, res) =>{
    const writing = await Writing.findById(req.params.id);
    const rating = new Rating(req.body.rating)
    writing.ratings.push(rating);
    await rating.save()
    await writing.save()
    req.flash('success', 'Created new rating.')
    res.redirect(`/writings/${writing._id}`)
})

// Remove reference to rating in campground, and the rating itself.
router.delete('/:ratingId', async (req, res)=>{
    const {id, ratingId: ratingId} = req.params;
    await Writing.findByIdAndUpdate(id, {$pull: {ratings: ratingId}});
    await Rating.findByIdAndDelete(ratingId);
    req.flash('success', 'Successfully deleted rating.')
    res.redirect(`/writings/${id}`)
})

module.exports = router;