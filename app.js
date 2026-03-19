const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./models/review.js");
const userRouter = require("./routes/user.js");

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

const sessionOptions = {
    secret:"mysupersecret",
    resave: false,
    saveUninitialized: true, 
    cookie:{
      expires: Date.now() + 7*24*60*60*1000,
      maxAge: 7*24*60*60*1000,
      httpOnly: true,
    }
};

app.get("/" ,(req, res)=>{
    res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// app.get("/demouser", async (req, res)=>{
//     let fakeUser = new User({
//       email: "demo@example.com",
//       username: "demoUser"
//     });
//     let registeredUser = await User.register(fakeUser, "password");
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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