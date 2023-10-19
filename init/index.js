 const initdata = require("./data.js")
const Listing = require("../models/listing.js")
const connectToDB = require("../db.js")

const initDB = async () =>{
    connectToDB("mongodb+srv://devendra:devendradhakad0101@cluster0.32w7em6.mongodb.net/wanderlust?retryWrites=true&w=majority");
   //await Listing.deleteMany()
 
     initdata.data =  initdata.data.map((obj)=>({...obj,owner:"653114f621b113adcf6a0a5a"}))
    await Listing.insertMany(initdata.data)
    console.log("data was intialized")
}
initDB()