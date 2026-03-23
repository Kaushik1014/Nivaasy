const Listing = require('../models/listing');

const DEFAULT_COORDINATES = [77.209, 28.6139]; // [lng, lat]

const geocodeAddress = async (address) => {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey || !address) return null;

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&limit=1&apiKey=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  const feature = data?.features?.[0];
  if (!feature?.geometry?.coordinates) return null;
  return feature.geometry.coordinates; // [lng, lat]
};

const parseCoordinatesFromBody = (listingBody = {}) => {
  const lat = Number.parseFloat(listingBody.lat);
  const lng = Number.parseFloat(listingBody.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return [lng, lat];
  }
  return null;
};

module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewListing =  (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
  if(!listing){
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  let coordinates = parseCoordinatesFromBody(req.body.listing);
  if (!coordinates) {
    const fullAddress = `${newListing.location}, ${newListing.country}`;
    coordinates = (await geocodeAddress(fullAddress)) || DEFAULT_COORDINATES;
  }
  newListing.geometry = { type: "Point", coordinates };

  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

module.exports.renderEditListing = async(req, res, next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    let orignalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, orignalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const updateData = { ...req.body.listing };
    let coordinates = parseCoordinatesFromBody(req.body.listing);

    if (!coordinates) {
      const fullAddress = `${updateData.location}, ${updateData.country}`;
      coordinates = (await geocodeAddress(fullAddress)) || DEFAULT_COORDINATES;
    }
    updateData.geometry = { type: "Point", coordinates };

    let listing = await Listing.findByIdAndUpdate(id, updateData);

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res, next)=>{
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};