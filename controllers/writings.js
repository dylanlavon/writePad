// Require dependency
const Writing = require("../models/writing");

// Find and Render all Writings at /writings/index
module.exports.index = async (req, res) => {
    const writings = await Writing.find({});
    res.render("writings/index", { writings });
};

// Render New form at /writings/new
module.exports.renderNewForm = (req, res) => {
    res.render("writings/new");
};

// Create new Writing object, save the object to MongoDB, flash success message and redirect to the new Writing's page
module.exports.createWriting = async (req, res) => {
    const writing = new Writing(req.body.writing);
    writing.author = req.user._id;
    await writing.save();
    req.flash("success", "Successfully created a new Writing!");
    res.redirect(`/writings/${writing._id}`);
};

// Create Show page for individual writing by populating required fields. If no such Writing exists, flash an error message and redirect to Writings index page.
module.exports.showWriting = async (req, res) => {
    const writing = await Writing.findById(req.params.id)
        .populate({
            path: "ratings",
            populate: {
                path: "author",
            },
        })
        .populate("author");

    if (!writing) {
        req.flash("error", "Cannot find that Writing...");
        return res.redirect("/writings");
    }
    res.render("writings/show", { writing });
};

// Render the Edit form for a specific Writing. If no such Writing exists, flash an error message and redirect to Writings Index page.
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const writing = await Writing.findById(id);
    if (!writing) {
        req.flash("error", "Cannot find that Writing...");
        return res.redirect("/writings");
    }
    res.render("writings/edit", { writing });
};

// Update a specific Writing's data, flash success message, and redirect to its show page.
module.exports.updateWriting = async (req, res) => {
    const { id } = req.params;
    const writing = await Writing.findByIdAndUpdate(id, {
        ...req.body.writing,
    });
    req.flash("success", "Successfully updated Writing.");
    res.redirect(`/writings/${writing._id}`);
};

// Deletes a specific Writing's data, flashes a success message, and redirects to Writings Index page.
module.exports.deleteWriting = async (req, res) => {
    const { id } = req.params;
    await Writing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Writing.");
    res.redirect("/writings");
};
