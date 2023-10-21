const Listing = require("../models/listing");
const Reviews = require("../models/review");

// create review
module.exports.createReview = async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  let review = req.body.review;
  review.author = req.user;
  let newReview = new Reviews(review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listings/${req.params.id}`);
};

//delete review
module.exports.deleteReview = async (req, res, next) => {
  let id = req.params.id;
  let reviewid = req.params.reviewid;
  await Reviews.findByIdAndDelete(reviewid);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${req.params.id}`);
};
