if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}
const express = require("express");
const router = express.Router();
const { wrapAcync, createError } = require("../utils/errorHandler.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });

const {
  isLoggedIn,
  isOwner,
  validationListing,
} = require("../middleware/middleware.js");
const {
  index,
  renderForm,
  createListing,
  showListing,
  editListing,
  updateListing,
  deleteListing,
 
} = require("../controllers/listing.js");

//Index Route // create route
router
  .route("/")
  .get(wrapAcync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
   // validationListing,
    wrapAcync(createListing)
  );

// New Route
router.get("/new", isLoggedIn, wrapAcync(renderForm));

// Show Route // update Route // delete Route
router
  .route("/:id")
  .get(wrapAcync(showListing))
  .put(isOwner, upload.single("listing[image]"), wrapAcync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAcync(deleteListing));

// edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAcync(editListing));

// map data

 

module.exports = router;
