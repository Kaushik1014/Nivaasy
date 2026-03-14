const express = require('express');
const router = express.Router();

//index route
router.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//new route
router.get("/listings/new" , (req, res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get("/listings/:id", wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/listings",validateListing, wrapAsync(async(req, res, next)=>{
    const newListing = new Listing(req.body.listing); 
    await newListing.save();
    res.redirect("/listings");
})) ;

//Edit route
router.get("/listings/:id/edit",wrapAsync(async(req, res, next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))

//update route
router.put("/listings/:id" , validateListing, wrapAsync(async(req, res, next)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id ,{...req.body.listing});
    res.redirect(`/listings/${ id }`);
}));

//delete route
router.delete("/listings/:id", wrapAsync(async(req,res, next)=>{
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})); 

module.exports = router;