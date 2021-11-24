const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')

router.get('/register', (req,res)=>{
    res.render('users/register')
})

router.post('/register', async (req,res, next)=>{
    try{
        const {email, username, password} = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err =>{
            if(err){
                return next(err)
            } else {
                req.flash('success', 'Welcome to WritePad!')
                res.redirect('/writings')
            }
        })      
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
    const redirectUrl = req.session.returnTo || '/writings'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success', 'We hope to see you back soon.')
    res.redirect('/writings')
})

module.exports = router;