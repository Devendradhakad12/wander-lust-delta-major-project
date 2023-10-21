const mongoose = require("mongoose");
const Reviews = require("./review.js");

const ListSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: [true, "Title is Required"],
    minLength: [4, "Title Must be 4 charactor"],
    maxLength: [55, "Title Should be minimum 15 charactor"],
  },
  description: {
    type: String,
    required: [true, "Description is Required"],
  },

  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: [true, "Price is Required"],
    min: [0, "Price not should be nagative"],
  },
  location: {
    type: String,
    required: [true, "Location is Required"],
  },
  country: {
    type: String,
    required: [true, "country is Required"],
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
});

ListSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Reviews.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", ListSchema);

module.exports = Listing;
