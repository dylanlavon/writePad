const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    if (req.body.isAdmin) {
      req.body.isAdmin = true;
      console.log(req.body.isAdmin);
    } else {
      req.body.isAdmin = false;
      console.log(req.body.isAdmin);
    }
    const { email, username, password, isAdmin } = req.body;
    const user = new User({ email, username, isAdmin });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to WritePad!");
        res.redirect("/writings");
        console.log(user);
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to WritePad!");
  const redirectUrl = req.session.returnTo || "/writings";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "We hope to see you back soon.");
  res.redirect("/writings");
};
