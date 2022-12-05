const passport = require("passport");
const User = require("../schemas/user.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


class AuthController {
  async register(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      user.password = hash;
      user
        .save()
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json(err);
        });
    });
  }

  async login(req, res) {
    const users = await User.find({
      username: req.body.username,
    });
    if (users.length === 0) {
      // Return an error if the user doesn't exist
      return res.status(401).json({ message: "Invalid username" });
    }
    passport.authenticate(
      "local",
      {
        username: req.body.username,
        password: req.body.password,
      },
      (err, user, info) => {
        if (err) {
          console.error(err);
          return res.status(500).json(err);
        }
        if (!user) {
          return res.status(401).json(info);
        }
        const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.SECRET,
          {
            expiresIn: 60 * 60 * 24,
          },
        );
        res.status(200).json({ token, user });
      },
    )(req, res);
  }
}

module.exports = new AuthController();
