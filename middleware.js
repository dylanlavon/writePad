module.exports.isLoggedIn = (req, res, next) => {  
    if(!req.isAuthenticated())
    {
        //Store the URL They are Requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in.')
        return res.redirect('/login')
    }
    next()
}