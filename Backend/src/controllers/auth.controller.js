const passport = require("passport");
const UserSchema = require("../schemas/user.schema")
const bcrypt = require("bcryptjs")
class AuthController {

  async register(req, res) {
    console.log(req.body)
    const user = new UserSchema({
      username: req.body.username,
      password: req.body.password,
    })

    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        console.log(err)
      }
      user.password = hash
      user.save().then((user) => {
        res.status(200).json(user)
      }).catch((err) => {
        res.status(500).json(err)
      })
    })
  }

  async login(req, res) {
    passport.authenticate("local", {
      username: req.body.username,
      password: req.body.password
    }, (err, user, info) => {
      console.log({ err, user, info })
      if (err) {
        console.log(err)
        return res.status(500).json(err)
      }
      if (!user) {
        return res.status(401).json(info)
      }
      // req.logIn(user, (err) => {
      //   if (err) {
      //     console.log(err)
      //     return res.status(500).json(err)
      //   }
      //   return res.status(200).json(user)
      // })
      return res.status(200).json(user)
    }
    )(req, res)
  }
}

module.exports = new AuthController() 