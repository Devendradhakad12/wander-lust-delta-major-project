const express = require("express");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const router = express.Router({ mergeParams: true });
const { wrapAcync } = require("../utils/errorHandler.js");

// add reviews route
router.post(
  "/",
  wrapAcync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
  })
);
router.delete(
  "/:reviewid",
  wrapAcync(async (req, res, next) => {
    let id = req.params.id;
    let reviewid = req.params.reviewid;
    await Reviews.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    res.redirect(`/listings/${req.params.id}`);
  })
);

module.exports = router;
