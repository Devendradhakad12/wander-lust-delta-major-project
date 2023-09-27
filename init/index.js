 const data = require("./data.js")
const Listing = require("../models/listing.js")
const connectToDB = require("../db.js")

const initDB = async () =>{
    connectToDB("mongodb://127.0.0.1:27017/wanderlust");
    await Listing.deleteMany()
    await Listing.insertMany(data.data)
    console.log("data was intialized")
}
initDB()