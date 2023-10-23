const Listing = require("../models/listing");
const axios = require("axios");

// Index
module.exports.index = async (req, res, next) => {
  const data = await Listing.find({});
  res.render("listings/index.ejs", { data });
};

// render form
module.exports.renderForm = async (req, res, next) => {
  res.render("listings/new.ejs");
};

// create listing
module.exports.createListing = async (req, res, next) => {
  let { path, filename } = req.file;
  let listingData = req.body.listing;
  listingData.owner = req.user._id;
  listingData.image = {
    url: path,
    filename,
  };
  const createListing = new Listing(listingData);
  await createListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

// show listing
module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  const data = await Listing.findById(id)
    .populate("owner")
    .populate({ path: "reviews", populate: { path: "author" } });

  if (!data) {
    req.flash("error", "Listing does not exists");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { data });
};

//edit listing - render edit page
module.exports.editListing = async (req, res, next) => {
  let { id } = req.params;
  const data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing does not exists");
    res.redirect("/listings");
  }
  let originalImageUrl = data.image.url;
  let imageurl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { data, imageurl });
};

// update listing - update listing
module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let { path, filename } = req.file;
    listing.image = { url: path, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

// delete listing
module.exports.deleteListing = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect(`/listings`);
};

 