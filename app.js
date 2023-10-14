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
const cookieParser = require('cookie-parser')
const session = require("express-session")
const flash = require("connect-flash")

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
app.use(cookieParser())
app.use(flash())
const sessionOptions = {
  secret:"mytempsecretcode",
  resave:"false",
  saveUninitialized:true,
  cookie:{
     expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
     maxAge:7 * 24 * 60 * 60 * 1000,
     httpOnly:true
  }
}
app.use(session(sessionOptions))

app.use((req,res,next)=>{
res.locals.success = req.flash("success")
res.locals.error = req.flash("error")
next()
})

// routes
app.get("/",(req,res,next)=>{
  res.cookie("name","ajay") 
  .redirect("/listings")
})
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
