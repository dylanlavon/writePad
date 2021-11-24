const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')

router.get('/register', (req,res)=>{
    res.render('users/register')
})

router.post('/register', async (req,res)=>{
    try{
        const {email, username, password} = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        req.flash('success', 'Welcome to WritePad!')
        res.redirect('/writings')
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
    
})

router.get('/login', (req,res)=>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req,res)=>{
    req.flash('success', 'Welcome back to WritePad!')
    res.redirect('/writings')
})

module.exports = router;