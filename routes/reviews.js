const express = require("express");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const router = express.Router({ mergeParams: true });
const { wrapAcync } = require("../utils/errorHandler.js");
const { isLoggedIn } = require("../middleware/middleware.js");

// add reviews route
router.post(
  "/",isLoggedIn,
  wrapAcync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created")
    res.redirect(`/listings/${req.params.id}`);
  })
);
router.delete(
  "/:reviewid",isLoggedIn,
  wrapAcync(async (req, res, next) => {
    let id = req.params.id;
    let reviewid = req.params.reviewid;
    await Reviews.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    req.flash("success" , "Review Deleted")
    res.redirect(`/listings/${req.params.id}`);
  })
);

module.exports = router;
