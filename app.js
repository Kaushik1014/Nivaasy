const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");

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


const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body); 
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }else{
        next();
    }
};

app.use("/listings", listings);

//review POST route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//review DELETE route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res)=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
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