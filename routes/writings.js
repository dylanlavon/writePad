const express = require('express')
const router = express.Router();
const Writing = require('../models/writing')
const {isLoggedIn} = require('../middleware')
const {isAuthor} = require('../middleware')


router.get('/', async (req,res) =>{
    const writings = await Writing.find({})
    res.render('writings/index', {writings})
})

router.get('/new', isLoggedIn, (req,res)=>{
    res.render('writings/new')
})

router.post('/', isLoggedIn, async(req, res)=>{  
    const writing = new Writing(req.body.writing)
    writing.author = req.user._id
    await writing.save();
    req.flash('success', 'Successfully created a new Writing!')
    res.redirect(`/writings/${writing._id}`)
})

router.get('/:id', async (req, res)=>{
    const writing = await Writing.findById(req.params.id).populate({
        path:'ratings',
    populate: {
        path: 'author'}
    }).populate('author')
    
    if(!writing){
        req.flash('error', 'Cannot find that Writing...')
        return res.redirect('/writings')
    }
    res.render('writings/show', {writing})
})

router.get('/:id/edit', isLoggedIn, isAuthor, async (req,res)=>{
    const {id} = req.params;
    const writing = await Writing.findById(id)  
    if(!writing){
        req.flash('error', 'Cannot find that Writing...')
        return res.redirect('/writings')
    }
    res.render('writings/edit', {writing})
})

router.put('/:id', isLoggedIn, isAuthor, async(req,res)=>{
    const {id} = req.params;  
    const writing = await Writing.findByIdAndUpdate(id, {...req.body.writing})
    req.flash('success', 'Successfully updated Writing.')
    res.redirect(`/writings/${writing._id}`)
})

router.delete('/:id', isLoggedIn, isAuthor, async (req, res)=>{
    const {id} = req.params;
    await Writing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Writing.')
    res.redirect('/writings')
})

module.exports = router;