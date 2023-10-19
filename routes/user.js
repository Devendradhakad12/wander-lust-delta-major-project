const express = require("express");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const User = require("../models/user.js");
const router = express.Router({ mergeParams: true });
const { wrapAcync } = require("../utils/errorHandler.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware/middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", saveRedirect, async (req, res) => {
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
});
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login", saveRedirect,
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to Wnaderlust");
  return  res.redirect(res.locals.redirectUrl);
  }
);

router.get("/logout", async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logout Successfuly");
    res.redirect("/listings");
  });
});

module.exports = router;
