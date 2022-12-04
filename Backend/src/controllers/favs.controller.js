const FavsSchema = require('../schemas/favs.schema')
const UserSchema = require('../schemas/user.schema')

class FavsController {
  async create(req, res) {
    const { favs, userID } = req.body
    const favsSchema = new FavsSchema({
      favs,
      user_id: userID
    })
    try {
      await favsSchema.save()
    }
    catch (err) {
      console.log(err)
    }
    const user = await UserSchema.findById(userID)
    user.favs_id = favsSchema._id
    user.save().then((user) => {
      res.status(200).json(user)
    }
    ).catch((err) => {
      res.status(500).json(err)
    }
    )
  }
  async read(req, res) {
    const user = await UserSchema.findById
      (req.body.userID).populate("favs")
    res.status(200).json(user)
  }
  async update(req, res) {
    const { favs, _id } = req.body
    FavsSchema.findByIdAndUpdate(_id, {
      favs
    }, {}, (err, favs) => {
      if (err) {
        res.status(500).json(err)
      }
      res.status(200).json(favs)
    })
  }
  async delete(req, res) {
    const { _id } = req.body
    FavsSchema.findByIdAndDelete(_id, (err, favs) => {
      if (err) {
        res.status(500).json(err)
      }
      res.status(200).json(favs)
    }
    )
  }
}