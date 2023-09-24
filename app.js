const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectToDB = require("./db");
const { errorHandler, catchErrorHandler } = require("./utils/errorHandler");
const Listing = require("./models/listing");
const app = express();
const PORT = process.env.PORT;

//* Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});


app.use(express.json())

app.get("/testlisting",async(req,res,next)=>{
  let samplelisting = new Listing({
    title:"my home",
    description:"by the beatch",
    price:1220,
    country:"india",
    location:"india"
  })
try {
  await samplelisting.save()
res.status(200).json({samplelisting})
 

} catch (err) {
  catchErrorHandler(res,err,next)
}
})

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
