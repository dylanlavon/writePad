// This module defines all of the routes pertaining to Writings - in particular, Creating new Writings, rendering the New and Edit Writing forms,
// rendering the Show page, as well as updating and deleting Writings. Additionally, we require the isLoggedIn and isRatingAuthor
// middleware to decide access and what to render.
// Module created in part by Dylan Britain, Trey Boyer, and Christian Dominguez

// Require External Dependencies
const express = require("express");
const router = express.Router();

// Require Local Dependencies
const { isLoggedIn, isAuthor } = require("../middleware");
const writings = require("../controllers/writings");

// For the '/writings/' route, run the index function upon receiving a GET request, or, upon receiving a POST request, after verifying that the user is logged in, run the createWriting function.
router.route("/").get(writings.index).post(isLoggedIn, writings.createWriting);

// For the '/writings/new' route, upon receiving a GET request, after running the isLoggedIn function, run the renderNewForm function.
router.get("/new", isLoggedIn, writings.renderNewForm);

// For the '/writings/:id' route, run the showWriting function upon receiving a GET request, or, upon receiving a PUT request, after verifying that the user is logged in and has permission to modify the specified writing, run the updateWriting function, or, upon receiving a DELETE request, after verifying that the user is logged in and has permission to modify the specified writing, run the deleteWriting function.
router
    .route("/:id")
    .get(writings.showWriting)
    .put(isLoggedIn, isAuthor, writings.updateWriting)
    .delete(isLoggedIn, isAuthor, writings.deleteWriting);

// For the '/writings/:id/edit' route, upon receiving a GET request, after verifying that the user is logged in and has permission to modify the specified writing, run the renderEditForm function.
router.get("/:id/edit", isLoggedIn, isAuthor, writings.renderEditForm);

// Export Routes
module.exports = router;
