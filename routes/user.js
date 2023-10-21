const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const { saveRedirect } = require("../middleware/middleware.js");
const {
  renderSignup,
  signupController,
  renderLogin,
  loginController,
  logoutController,
} = require("../controllers/users.js");

// render signup page
router.get("/signup", renderSignup);

//sign up route
router.post("/signup", saveRedirect, signupController);

// render login page
router.get("/login", renderLogin);

// login route
router.post(
  "/login",
  saveRedirect,
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  loginController
);

router.get("/logout", logoutController);

module.exports = router;
