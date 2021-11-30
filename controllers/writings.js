// Require the Writing model
const Writing = require("../models/writing");

// The index function finds and renders all Writings.
// Additionally, the index function is set as an asynchronous function in order to handle the asynchronous 'find' function call to MongoDB.
module.exports.index = async (req, res) => {
    const writings = await Writing.find({});
    // The second parameter of the render function sends the index page an object that consists of the key "writings" and value equal to the writings variable.
    // i.e.:
    // {
    //      "writings": {
    //          "sampleKey": "sampleValue",
    //          etc...
    //      }
    // }
    res.render("writings/index", { writings });
};

// The renderNewForm function displays a form for an Author or Admin to create a new Writing.
module.exports.renderNewForm = (req, res) => {
    res.render("writings/new");
};

// The createWriting function creates a new Writing object, saves the object to the MongoDB, and finally displays a success message and redirects the Author or Admin to the new Writing's page
// Additionally, the createWriting function is set as an asynchronous function in order to handle the asynchronous 'save' function call to MongoDB.
module.exports.createWriting = async (req, res) => {
    const writing = new Writing(req.body.writing);
    writing.author = req.user._id;
    await writing.save();
    req.flash("success", "Successfully created a new Writing!");
    res.redirect(`/writings/${writing._id}`);
};

// The showWriting function shows a page for an individual writing by populating the required fields. If the specified Writing does not exist, then display an error message and redirect to Writings index page.
// Additionally, the showWriting function is set as an asynchronous function in order to handle the asynchronous 'findById' function call to MongoDB.
module.exports.showWriting = async (req, res) => {
    // Find the Writing specified by the requested ID and retrieve the associated Author and Ratings.
    const writing = await Writing.findById(req.params.id)
        .populate({
            path: "ratings",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    
    // Display an error if the specified writing cannot be found and redirect to the Writings subpage
    if (!writing) {
        req.flash("error", "Cannot find that Writing...");
        return res.redirect("/writings");
    }
    res.render("writings/show", { writing });
};

// The renderEditForm function renders the Edit form for a given Writing. If the specified Writing does not exist, then display an error message and redirect to the Writings index page.
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const writing = await Writing.findById(id);
    if (!writing) {
        req.flash("error", "Cannot find that Writing...");
        return res.redirect("/writings");
    }
    res.render("writings/edit", { writing });
};

// The updateWriting function updates a given Writing's data, displays a success message, and redirects to the Writing's show page.
module.exports.updateWriting = async (req, res) => {
    const { id } = req.params;
    const writing = await Writing.findByIdAndUpdate(id, {
        ...req.body.writing,
    });
    req.flash("success", "Successfully updated Writing.");
    res.redirect(`/writings/${writing._id}`);
};

// The deleteWriting function deletes a given Writing's data, displays a success message, and redirects to the Writing's index page.
module.exports.deleteWriting = async (req, res) => {
    const { id } = req.params;
    await Writing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Writing.");
    res.redirect("/writings");
};
