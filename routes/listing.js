 const express = require('express')
 const Listing = require("../models/listing.js");
 const Reviews = require("../models/review.js");
 const router = express.Router()
 const {
    wrapAcync,
    createError,
  } = require("../utils/errorHandler.js");
  const { listingSchema } = require("../schema.js");

  //* schema validation using joi
const validationListing = (req, res, next) => {
    const result = listingSchema.validate(req.body);
//    console.log(result);
    if (result.error) {
      return next(createError(400, result.error));
    }
    next();
  };

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
    wrapAcync(async (req, res, next) => {
      res.render("listings/new.ejs");
    })
  );

  

// create route
router.post(
    "/",
    validationListing,
    wrapAcync(async (req, res, next) => {
      const createListing = new Listing(req.body.listing);
      await createListing.save();
      req.flash("success" , "New Listing Created")
      res.redirect("/listings");
    })
  );
  
  // Show Route
  router.get(
    "/:id",
    wrapAcync(async (req, res, next) => {
      let { id } = req.params;
      const data = await Listing.findById(id).populate("reviews");
      if(!data){
        req.flash("error","Listing does not exists")
        res.redirect("/listings");
      }
      res.render("listings/show.ejs", { data });
    })
  );
  // edit Route
  router.get(
    "/:id/edit",
    wrapAcync(async (req, res, next) => {
      let { id } = req.params;
      const data = await Listing.findById(id);
      res.render("listings/edit.ejs", { data });
    })
  );
  // update Route
  router.put(
    "/:id",
    validationListing,
    wrapAcync(async (req, res, next) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      req.flash("success" , "Listing Updated")
      res.redirect(`/listings/${id}`);
    })
  );
  // delete Route
  router.delete(
    "/:id",
    wrapAcync(async (req, res, next) => {
      let { id } = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success" , "Listing Deleted")
      res.redirect(`/listings`);
    })
  );
  
 


module.exports  =  router