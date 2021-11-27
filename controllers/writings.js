const Writing = require("../models/writing");

module.exports.index = async (req, res) => {
    const writings = await Writing.find({});
    res.render("writings/index", { writings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("writings/new");
};

module.exports.createWriting = async (req, res) => {
    const writing = new Writing(req.body.writing);
    writing.author = req.user._id;
    await writing.save();
    req.flash("success", "Successfully created a new Writing!");
    res.redirect(`/writings/${writing._id}`);
};

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

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const writing = await Writing.findById(id);
    if (!writing) {
        req.flash("error", "Cannot find that Writing...");
        return res.redirect("/writings");
    }
    res.render("writings/edit", { writing });
};

module.exports.updateWriting = async (req, res) => {
    const { id } = req.params;
    const writing = await Writing.findByIdAndUpdate(id, {
        ...req.body.writing,
    });
    req.flash("success", "Successfully updated Writing.");
    res.redirect(`/writings/${writing._id}`);
};

module.exports.deleteWriting = async (req, res) => {
    const { id } = req.params;
    await Writing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Writing.");
    res.redirect("/writings");
};
