// Require dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Rating = require("./rating");

// Establish Writing Schema for MongoDB
const WritingSchema = new Schema({
    title: String,
    writingText: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    ratings: [
        {
            type: Schema.Types.ObjectId,
            ref: "Rating",
        },
    ],
});

//Writing Deletion Middleware
WritingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Rating.remove({
            _id: {
                $in: doc.ratings,
            },
        });
    }
});

// Export WritingSchema
module.exports = mongoose.model("Writing", WritingSchema);
