require('dotenv').config();
bcrypt = require('bcryptjs');
const express = require('express')
// const path = require('path')
const cookieParser = require('cookie-parser')
const createError = require('http-errors')
const logger = require('morgan')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./schemas/user.schema')

require('./db')
const indexRoutes = require('./routes/index')

const app = express()
const port = process.env.PORT || 3000

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use('/api', indexRoutes)

// catch 404 
app.use(function (req, res, next) {
  res.status(404).json({ message: "Not found" })
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

// session
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }, (err, user) => {
//       if (err) {
//         console.log(err)
//         return done(err)
//       }
//       bcrypt.compare(password, user.password, (err, res) => {
//         if (res) {
//           return done(null, user)
//         } else {
//           return done(null, false, { message: "Incorrect password" })
//         }
//       })
//     })
//   })
// )


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new LocalStrategy((username, password, done) => {
    // Use the find method to search for the user by username
    User.find({ username: username }, (err, user) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user[0].password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          // Return an error if the password is incorrect
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

module.exports = app