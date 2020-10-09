const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../Models/User");

const router = express.Router();

//login page
router.get("/login", (req, res) => {
  res.render("login");
});

//register page
router.get("/register", (req, res) => {
  res.render("register");
});

// Register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //validation passed

    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//staer quiz
router.get("/quiz", (req, res) => {
  res.render("quiz");
});

//logout
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Logged out successifully!!");
  res.redirect("/users/login");
});

module.exports = router;
