const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");


//index route
router.get("/", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new route
router.get("/new" ,isLoggedIn, (req, res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
  if(!listing){
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/", validateListing, isLoggedIn, wrapAsync(async (req, res) => {
  if(!req.body.listing.image.url){
    delete req.body.listing.image;
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req, res, next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id",validateListing, isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    req.body.listing.image.filename = "listingimage";
    let { id } = req.params;
    await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(async(req,res, next)=>{
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
})); 

module.exports = router;