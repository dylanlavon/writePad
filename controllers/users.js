// This module takes in data that has been passed by the users.js route and can register users, login users, log out users, or simply render the 
// login page. 
// We require the user model in order to add / delete user objects within our Mongo Database.
// Module created in part by Dylan Britain, Trey Boyer, and Duy Tran

// Require the User model
const User = require("../models/user");

// Render the user registration view
module.exports.renderRegister = (req, res) => {
    res.render("users/register");
};

// The register function registers a new User. If an error occurs with registration (i.e., a user with the specified username already exists), then display an error message. Otherwise, display a success message and redirect to the Writings index.
module.exports.register = async (req, res, next) => {
    try {
        // check for the isAdmin flag
        if (req.body.isAdmin) {
            req.body.isAdmin = true;
        } else {
            req.body.isAdmin = false;
        }

        // The following line is an object destructuring assignment (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
        // It sets the variables email, username, password, and isAdmin equal to the values of the properties of the req.body object.
        // I.e., const email = req.body.email;
        const { email, username, password, isAdmin } = req.body;
        const user = new User({ email, username, isAdmin });
        // Note that this User.register function is from the passport-local-mongoose library and is NOT the same as the register function that we are currently in.
        const registeredUser = await User.register(user, password); 
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            } else {
                // Upon successful registration, display a success message and redirect to the Writings index.
                req.flash("success", "Welcome to WritePad!");
                res.redirect("/writings");
                console.log(user);
            }
        });
    } catch (e) {
        // Display any caught errors and redirect to the User registration page
        req.flash("error", e.message);
        res.redirect("/register");
    }
};

// The renderLogin function renders the User login form
module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

// The login function logs the User in. Displays a success message and redirects back to the previous page or the Writings index if a previous page was not specified. Finally, the returnTo property is deleted.
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to WritePad!");
    const redirectUrl = req.session.returnTo || "/writings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

// The logout function logs the User out. Displays a success message and then redirects back to the Writings index.
module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "We hope to see you back soon.");
    res.redirect("/writings");
};
