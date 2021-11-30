// If not running a production build, require the dotenv module
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Require External Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoDBStore = require("connect-mongo");

// Require Local Dependencies
const User = require("./models/user");
const writingRoutes = require("./routes/writings");
const ratingRoutes = require("./routes/ratings");
const userRoutes = require("./routes/users");

// Establish URI connection to a remote MongoDB if the DB_URL environment variable is specified, or a local MongoDB instance otherwise
// It is recommended that the DB_URL environment variable be specified in a production environment
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/write-pad";
console.log(dbUrl);
mongoose.connect(dbUrl);

// Connect to our MongoDB and log any connection errors or announce a successful connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

// Initialize Express. Sets our view Engine to EJS, sets our views file path, and additional config.
const app = express();

// Because we're using EJS to render our webpages, set the view engine to EJS and set the views directory to ./views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Establish Store for MongoDB
const secret = "thisshouldbeabettersecret";
const store = new MongoDBStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, // If nothing in a session changes, only update after 1 day (24 hours * 60 minutes * 60 seconds) or when something actually changes
    crypto: {
        secret,
    },
});
// Log errors for Session Store
store.on("error", function (err) {
    console.log("SESSION STORE ERROR", err);
});
// Establish Config for Session, including Cookie settings.
const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Cookies expire after 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // Max age of cookies is set to 1 week
    },
};

//Tell Express to use Session (with specificed Config) and Flash middleware.
app.use(session(sessionConfig));
app.use(flash());

// Tell Express to use Passport library to handle User Authentication
app.use(passport.initialize());
app.use(passport.session());

// Tell Express to use a local authentication method, rather than a third-party method (i.e., Facebook or Google)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Set our EJS engine to ejsMate
app.engine("ejs", ejsMate);

//Set up basic route paths
app.use("/", userRoutes);
app.use("/writings", writingRoutes);
app.use("/writings/:id/ratings", ratingRoutes);
app.get("/", (req, res) => {
    res.render("home");
});

//Establish Serving Ports
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
