// Require dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Establish Rating Schema for MongoDB
const ratingSchema = new Schema({
    body: String,
    ratingValue: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// Export ratingSchema
module.exports = mongoose.model("Rating", ratingSchema);
