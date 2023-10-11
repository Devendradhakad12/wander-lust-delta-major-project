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

const listingRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/reviews.js");

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
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews",reviewsRoute)

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
