const Listing = require("../models/listing");
const Reviews = require("../models/review");
const { listingSchema } = require("../schema.js");
const { wrapAcync, createError } = require("../utils/errorHandler.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Login first");
    return res.redirect("/auth/login");
  }
  next();
};

module.exports.saveRedirect = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  } else {
    res.locals.redirectUrl = "/listings";
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(req.user?._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewid } = req.params;
  let { id } = req.params;
  const review = await Reviews.findById(reviewid);
  if (!review?.author._id.equals(req.user?._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//* schema validation using joi
module.exports.validationListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  //    console.log(result);
  if (result.error) {
    return next(createError(400, result.error));
  }
  next();
};
