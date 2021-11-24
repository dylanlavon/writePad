const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    body: String,
    ratingValue: Number
})

module.exports = mongoose.model("Rating", ratingSchema);