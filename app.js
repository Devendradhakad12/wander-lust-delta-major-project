const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectToDB = require("./db");
const {
  errorHandler,
  catchErrorHandler,
  wrapAcync,
  createError,
} = require("./utils/errorHandler");
const path = require("path");
const app = express();
const PORT = process.env.PORT;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { listingSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const Reviews = require("./models/review.js");

//* Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//* schema validation using joi
const validationListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    return next(createError(400, result.error));
  }
  next();
};

//? ejs setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
// Inddex Route
app.get(
  "/listings",
  wrapAcync(async (req, res, next) => {
    const data = await Listing.find({});
    res.render("listings/index.ejs", { data });
  })
);

// New Route
app.get(
  "/listings/new",
  wrapAcync(async (req, res, next) => {
    res.render("listings/new.ejs");
  })
);

// create route
app.post(
  "/listings",
  validationListing,
  wrapAcync(async (req, res, next) => {
    const createListing = new Listing(req.body.listing);
    await createListing.save();
    res.redirect("/listings");
  })
);

// Show Route
app.get(
  "/listings/:id",
  wrapAcync(async (req, res, next) => {
    let { id } = req.params;
    const data = await Listing.findById(id).populate('reviews');
    res.render("listings/show.ejs", { data });
  })
);
// edit Route
app.get(
  "/listings/:id/edit",
  wrapAcync(async (req, res, next) => {
    let { id } = req.params;
    const data = await Listing.findById(id);
    res.render("listings/edit.ejs", { data });
  })
);
// update Route
app.put(
  "/listings/:id",
  validationListing,
  wrapAcync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);
// delete Route
app.delete(
  "/listings/:id",
  wrapAcync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
  })
);

// add reviews route
app.post(
  "/listings/:id/reviews",
  wrapAcync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
  })
);

// if page not avilable
app.all("*", (req, res, next) => {
  next(createError(404, "Page Not Found"));
});

app.use(errorHandler);
app.listen(PORT, () => {
  connectToDB(process.env.MONGODB_URI);
  console.log(`app is listning on http://localhost:${PORT}`);
});

//* unhandled promise rejection - mongoConnection String error handling
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to inhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
