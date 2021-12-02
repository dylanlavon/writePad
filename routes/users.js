// This module defines all of the routes pertaining to Users - in particular, Rendering the Login page, Passport Authentication, 
// and logging users in / out.
// Module created in part by Dylan Britain, Trey Boyer, and Christian Dominguez

// Require External Dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Require Local Dependencies
const users = require("../controllers/users");

// For the '/register' route, run the renderRegister function upon receiving a GET request, or run the register function upon receiving a POST request
router.route("/register").get(users.renderRegister).post(users.register);

// For the '/login' route, run the renderLogin function upon receiving a GET request, or run the Passport authentication function followed by the login function upon receiving a POST request
router
    .route("/login")
    .get(users.renderLogin)
    .post(
        // Run Passport Auth
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        users.login
    );

// For the '/logout' route, run the logout function upon receiving a GET request
router.get("/logout", users.logout);

// Export Routes
module.exports = router;
