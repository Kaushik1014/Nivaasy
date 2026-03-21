const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");

const listingsController = require("../controllers/listings.js");

//index route
router.get("/", wrapAsync(listingsController.index));
//new route
router.get("/new" ,isLoggedIn, listingsController.renderNewListing);

//show route
router.get("/:id", wrapAsync(listingsController.showListing));

//create route
router.post("/", validateListing, isLoggedIn, wrapAsync(listingsController.createListing));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingsController.renderEditListing));

//update route
router.put("/:id",validateListing, isLoggedIn, isOwner, wrapAsync(listingsController.updateListing));

//delete route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingsController.deleteListing)); 

module.exports = router;