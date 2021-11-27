//If not running a production build, require dotenv
if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}

//Require Dependencies 
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const writingRoutes = require("./routes/writings");
const ratingRoutes = require("./routes/ratings");
const userRoutes = require("./routes/users");

// Require Mongo Atlas support and establish URI connection
const MongoDBStore = require("connect-mongo")
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/write-pad"
console.log(dbUrl)
mongoose.connect(dbUrl);

//Log DB connection errors / successful connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

// Configure Express. Sets our view Engine to EJS, sets our views file path, and additional config.
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Establish Store for MongoDB
const secret = 'thisshouldbeabettersecret'
const store = new MongoDBStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
})
 // Log errors for Session Store
store.on("error", function(err){
    console.log("SESSION STORE ERROR", err)
})
// Establish Config for Session, including Cookie settings.
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

//Tell Express to use Session (with specificed Config) and Flash.
app.use(session(sessionConfig));
app.use(flash());

// Tell Express to use Passport to handle User Auth
app.use(passport.initialize());
app.use(passport.session());
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
