const express = require("express");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const User = require("../models/user.js");
const router = express.Router({ mergeParams: true });
const { wrapAcync } = require("../utils/errorHandler.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {

try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    await User.register(newUser, password);
    req.flash("success", "Welcome to Wnaderlust");
    res.redirect("/listings");
    
} catch (error) {
    req.flash("error", error.message);
    res.redirect("/auth/signup"); 
}
});
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureRedirect:"/auth/login",failureFlash:true}), async (req, res) => {

  req.flash("success", "Welcome to Wnaderlust");
  res.redirect("/listings");
});
 
module.exports = router;
