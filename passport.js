const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("./Models/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "This email is not registered, first register yourself",
            });
          }

          //match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password does not match" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  //serializing
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //deserialize
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
