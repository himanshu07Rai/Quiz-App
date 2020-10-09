const express = require("express");
const mongoose = require("mongoose");
const expressLayout = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const homeRoute = require("./Routes/index");
const userRoute = require("./Routes/user");

const app = express();
// Express body parser
app.use(express.urlencoded({ extended: true }));

//Passport config
require("./passport")(passport);

//ejs
app.use(expressLayout);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/Public"));

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//passport midleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", homeRoute);
app.use("/users", userRoute);

const PORT = 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.guicc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() =>
    app.listen(PORT, () => {
      console.log("Listening for requests....");
    })
  )
  .catch((err) => {
    console.log(err);
  });
// "dev": "nodemon app.js"
