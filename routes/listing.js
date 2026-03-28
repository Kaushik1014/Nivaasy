const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const listingsController = require("../controllers/listings.js");


//index and create route
router
    .route("/")
    .get(wrapAsync(listingsController.index))
    .post(isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingsController.createListing));
//new route
router.get("/new", isLoggedIn, listingsController.renderNewListing);

//search suggestions API
router.get("/search/suggestions", wrapAsync(listingsController.searchSuggestions));

//show, update and delete route
router
    .route("/:id")
    .get(wrapAsync(listingsController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingsController.renderEditListing));

module.exports = router;