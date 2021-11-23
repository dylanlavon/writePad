const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Story = require('./models/story')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Review = require('./models/review')

mongoose.connect('mongodb://localhost:27017/write-pad')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected!")
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

app.get('/', (req,res) =>{
    res.render('home')
})

app.get('/stories', async (req,res) =>{
    const stories = await Story.find({})
    res.render('stories/index', {stories})
})

app.get('/stories/new', (req,res)=>{
    res.render('stories/new')
})

app.post('/stories', async(req, res)=>{
    const story = new Story(req.body.story)
    await story.save();
    res.redirect(`/stories/${story._id}`)
})

app.get('/stories/:id', async (req, res)=>{
    const story = await Story.findById(req.params.id).populate('reviews')
    res.render('stories/show', {story})
})

app.get('/stories/:id/edit', async (req,res)=>{
    const story = await Story.findById(req.params.id)
    res.render('stories/edit', {story})
})

app.put('/stories/:id', async(req,res)=>{
    const {id} = req.params;
    const story = await Story.findByIdAndUpdate(id, {...req.body.story})
    res.redirect(`/stories/${story._id}`)
})

app.delete('/stories/:id', async (req, res)=>{
    const {id} = req.params;
    await Story.findByIdAndDelete(id);
    res.redirect('/stories')
})

app.post('/stories/:id/reviews', async (req, res) =>{
    const story = await Story.findById(req.params.id);
    const review = new Review(req.body.review)
    story.reviews.push(review);
    await review.save()
    await story.save()
    res.redirect(`/stories/${story._id}`)
})

// Remove reference to review in campground, and the review itself.
app.delete('/stories/:id/reviews/:reviewId', async (req, res)=>{
    const {id, reviewId} = req.params;
    await Story.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/stories/${id}`)
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})