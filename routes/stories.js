const express = require('express')
const router = express.Router();
const Story = require('../models/story')

router.get('/', async (req,res) =>{
    const stories = await Story.find({})
    res.render('stories/index', {stories})
})

router.get('/new', (req,res)=>{
    res.render('stories/new')
})

router.post('/', async(req, res)=>{  
    const story = new Story(req.body.story)
    await story.save();
    req.flash('success', 'Successfully created a new story!')
    res.redirect(`/stories/${story._id}`)
})

router.get('/:id', async (req, res)=>{
    const story = await Story.findById(req.params.id).populate('reviews')
    if(!story){
        req.flash('error', 'Cannot find that story...')
        return res.redirect('/stories')
    }
    res.render('stories/show', {story})
})

router.get('/:id/edit', async (req,res)=>{
    const story = await Story.findById(req.params.id)
    if(!story){
        req.flash('error', 'Cannot find that story...')
        return res.redirect('/stories')
    }
    res.render('stories/edit', {story})
})

router.put('/:id', async(req,res)=>{
    const {id} = req.params;
    const story = await Story.findByIdAndUpdate(id, {...req.body.story})
    req.flash('success', 'Successfully updated story.')
    res.redirect(`/stories/${story._id}`)
})

router.delete('/:id', async (req, res)=>{
    const {id} = req.params;
    await Story.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted story.')
    res.redirect('/stories')
})

module.exports = router;