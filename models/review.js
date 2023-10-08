const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required:[true,"Comment is Required"]
  },

  rating: {
    type: Number,
    required: [true, "Rating is Required"],
    min: [0, "Rating not should be nagative"],
    max: [5, "Rating not should be greater then 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Reviews = mongoose.model("Reviews", ReviewSchema);

module.exports = Reviews;
