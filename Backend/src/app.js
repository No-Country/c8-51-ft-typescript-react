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
const jwt = require('jsonwebtoken');
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

app.use((req, res, next) => {
  // If there is no JWT in the request, continue to the next middleware
  if (!req.headers.authorization) {
    return next();
  }

  // If there is a JWT in the request, verify it using the secret key
  jwt.verify(req.headers.authorization, secretKey, (err, decoded) => {
    if (err) {
      // If the JWT is invalid, return an error
      return res.status(401).json({ error: 'Invalid token' });
    }

    // If the JWT is valid, add the decoded user information to the request object
    req.user = decoded;
    next();
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

module.exports = app