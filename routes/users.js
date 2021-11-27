const express = require("express");
// Require dependencies
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

// /register routes. Render register form / post register form
router.route("/register").get(users.renderRegister).post(users.register);

// /login routes. Render login form and / post login form.
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

// /logout route. Logs out users.
router.get("/logout", users.logout);

// Export Routes
module.exports = router;
