const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");

const reviewsController = require("../controllers/reviews.js");


//review POST route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));

//review DELETE route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.deleteReview));

module.exports = router;