// Require dependencies
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const { isAuthor } = require("../middleware");
const writings = require("../controllers/writings");

// /writings routes. Get index of writings / post new writing.
router.route("/").get(writings.index).post(isLoggedIn, writings.createWriting);

// /writings/new route. Renders new form if user is logged in.
router.get("/new", isLoggedIn, writings.renderNewForm);

// /writings/:id routes. Renders Writing show page, puts edited Writing, deletes writing if user is Author / Admin.
router
    .route("/:id")
    .get(writings.showWriting)
    .put(isLoggedIn, isAuthor, writings.updateWriting)
    .delete(isLoggedIn, isAuthor, writings.deleteWriting);

// /writings/:id/edit route. Renders edit form if user is logged in and original Author / Admin.
router.get("/:id/edit", isLoggedIn, isAuthor, writings.renderEditForm);

// Export Routes
module.exports = router;
