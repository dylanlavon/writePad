// Require Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Establish User Schema for MongoDB
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
});
// Plugin Passport functionality for MongoDB
UserSchema.plugin(passportLocalMongoose);

// Export UserSchema
module.exports = mongoose.model("User", UserSchema);
