const User = require("../models/user.js");

// render signup page
module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

// sign up
module.exports.signupController = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password); // signup with passwort middlewere
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to Wnaderlust");
        res.redirect(res.locals.redirectUrl);
      }
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/auth/signup");
  }
};

// render login page
module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

// login
module.exports.loginController = async (req, res) => {
  req.flash("success", "Welcome to Wnaderlust");
  return res.redirect(res.locals.redirectUrl);
};

//logout
module.exports.logoutController = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logout Successfuly");
    res.redirect("/listings");
  });
};
