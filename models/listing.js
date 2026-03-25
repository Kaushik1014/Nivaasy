const mongoose = require("mongoose");
const Review = require("./review.js");
const { urlencoded } = require("express");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url: String,
    filename: String,
  },

  price: Number,
  location: String,
  country: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [77.209, 28.6139], // [lng, lat] fallback (New Delhi)
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner :{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["mountains", "artic","farms","deserts"],
    required: true,
  },
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
   await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;