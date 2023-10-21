const express = require("express");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const router = express.Router({ mergeParams: true });
const { wrapAcync } = require("../utils/errorHandler.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware/middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews.js");

// add reviews route
router.post("/", isLoggedIn, wrapAcync(createReview));

// delete review
router.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  wrapAcync(deleteReview)
);

module.exports = router;
