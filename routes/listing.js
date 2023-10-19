const express = require("express");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const router = express.Router();
const { wrapAcync, createError } = require("../utils/errorHandler.js");
const {
  isLoggedIn,
  isOwner,
  validationListing,
} = require("../middleware/middleware.js");

//Index Route
router.get(
  "/",
  wrapAcync(async (req, res, next) => {
    const data = await Listing.find({});
    res.render("listings/index.ejs", { data });
  })
);

// New Route
router.get(
  "/new",
  isLoggedIn,
  wrapAcync(async (req, res, next) => {
    res.render("listings/new.ejs");
  })
);

// create route
router.post(
  "/",
  validationListing,
  wrapAcync(async (req, res, next) => {
    let listingData = req.body.listing;
    listingData.owner = req.user._id;
    const createListing = new Listing(listingData);
    await createListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

// Show Route
router.get(
  "/:id",
  wrapAcync(async (req, res, next) => {
    let { id } = req.params;
    const data = await Listing.findById(id)
      .populate("owner")
     .populate({path:"reviews",populate:{path:"author"}});
    
    if (!data) {
      req.flash("error", "Listing does not exists");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { data });
  })
);
// edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAcync(async (req, res, next) => {
    let { id } = req.params;
    const data = await Listing.findById(id);
    res.render("listings/edit.ejs", { data });
  })
);
// update Route
router.put(
  "/:id",
  isOwner,
  validationListing,
  wrapAcync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);
// delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAcync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect(`/listings`);
  })
);

module.exports = router;
