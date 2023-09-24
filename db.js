const mongoose = require("mongoose");

const connectToDB = async (uri)=>{
try {
    await mongoose.connect(uri)
    console.log("MongoDB connected!")
} catch (error) {
    if(error.name === "MongoParseError"){
      return  console.log(error.message)
    }
    console.log(error)
}
}

module.exports = connectToDB