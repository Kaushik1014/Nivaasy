const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

main()
.then(()=>{console.log("connection successful")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/nivaasly");
}

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views" ,path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/" ,(req, res)=>{
    res.send("Hi, I am root");
});

//index route
app.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//new route
app.get("/listings/new" , (req, res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//create route
app.post("/listings", wrapAsync(async(req, res, next)=>{
    if(!req.body.listing) throw new ExpressError("Send valid data for listing", 400);
    const newListing = new Listing(req.body.listing); 
    await newListing.save();
    res.redirect("/listings");
})) ;

//Edit route
app.get("/listings/:id/edit",wrapAsync(async(req, res, next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))

//update route
app.put("/listings/:id" , wrapAsync(async(req, res, next)=>{
    if (!req.body.listing) throw new ExpressError("Send valid data for listing", 400);
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id ,{...req.body.listing});
    res.redirect(`/listings/${ id }`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async(req,res, next)=>{
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})); 

app.use((req, res, next)=>{
  next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next)=>{
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});