const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const reviewRouter = require("./routes/review.js");

const listings = require("./routes/listing.js");
const review = require("./models/review.js");


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


app.use("/listings", listings);

app.use("/listings/:id/reviews", reviewRouter);

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