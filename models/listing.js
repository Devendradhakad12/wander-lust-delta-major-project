const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is Required"],
  },
  description: {
    type: String,
    required: [true, "Description is Required"],
  },

  image: {
    type: String,
    default:"https://images.unsplash.com/photo-1533984899405-a7d715bac484?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNlZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
    set:(v)=> v === "" ? "https://images.unsplash.com/photo-1533984899405-a7d715bac484?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNlZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" : v
  },
  price: {
    type: Number,
    required: [true, "Price is Required"],
  },
  location: {
    type: String,
    required: [true, "Location is Required"],
  },
  country: {
    type: String,
    required: [true, "country is Required"],
  },
});

const Listing = mongoose.model("Listing", ListSchema);

module.exports = Listing;
