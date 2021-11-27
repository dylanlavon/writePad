// Require dependency
const User = require("../models/user");

// Render the register form
module.exports.renderRegister = (req, res) => {
    res.render("users/register");
};

// Register a new User. Flash error message if a message is caught. Else, flash success message and redirect to Writings index.
module.exports.register = async (req, res, next) => {
    try {
        // isAdmin flag
        if (req.body.isAdmin) {req.body.isAdmin = true} else {req.body.isAdmin = false}

        const { email, username, password, isAdmin } = req.body;
        const user = new User({ email, username, isAdmin });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash("success", "Welcome to WritePad!");
                res.redirect("/writings");
                console.log(user);
            }
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
};

// Render Login form
module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

// Logs user back in. Flashes success message and redirects back to previous page or Writings index. After redirect, deletes 'returnTo' address.
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to WritePad!");
    const redirectUrl = req.session.returnTo || "/writings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

// Logs user out. Flashes success message, then redirects back to Writings index.
module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "We hope to see you back soon.");
    res.redirect("/writings");
};
