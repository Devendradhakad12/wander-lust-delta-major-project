const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectToDB = require("./db");
const { errorHandler, catchErrorHandler } = require("./utils/errorHandler");
const Listing = require("./models/listing");
const path = require("path");
const app = express();
const PORT = process.env.PORT;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")

//* Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//? ejs setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))
// Inddex Route
app.get("/listings", async (req, res, next) => {
  try {
    const data = await Listing.find({});
    res.render("listings/index.ejs", { data });
  } catch (err) {
    catchErrorHandler(res, err, next);
  }
});

// New Route
app.get("/listings/new", async (req, res, next) => {
  try {
    res.render("listings/new.ejs");
  } catch (error) {
    catchErrorHandler(res, err, next);
  }
});

// create route
app.post("/listings", async (req, res, next) => {
  try {
    const createListing = new Listing(req.body.listing);
    await createListing.save();
    res.redirect("/listings");
  } catch (err) {
    catchErrorHandler(res, err, next);
  }
});

// Show Route
app.get("/listings/:id", async (req, res, next) => {
  let { id } = req.params;
  try {
    const data = await Listing.findById(id);
    res.render("listings/show.ejs", { data });
  } catch (err) {
    catchErrorHandler(res, err, next);
  }
});
// edit Route
app.get("/listings/:id/edit", async (req, res, next) => {
  let { id } = req.params;
  try {
    const data = await Listing.findById(id);
    res.render("listings/edit.ejs", { data });
  } catch (err) {
    catchErrorHandler(res, err, next);
  }
});
// update Route
app.put("/listings/:id", async (req, res, next) => {
  let { id } = req.params;
  try {
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    catchErrorHandler(res, err, next);
  }
});
// delete Route
app.delete("/listings/:id", async (req, res, next) => {
  let { id } = req.params;
  try {
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
  } catch (err) {
    catchErrorHandler(res, err, next);
  }
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
