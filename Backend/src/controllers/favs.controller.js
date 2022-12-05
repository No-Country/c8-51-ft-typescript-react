const FavsSchema = require('../schemas/favs.schema')
const UserSchema = require('../schemas/user.schema')
class FavsController {
  async create(req, res) {
    const { symbol, userID } = req.body;
    try {
      const user = await UserSchema.findById(userID).populate("favs");
      const favs = await FavsSchema.findById(user.favs._id);
      const newFavs = [...favs.favs, symbol];
      FavsSchema.findByIdAndUpdate(
        user.favs._id,
        {
          favs: newFavs,
        },
        { new: true },
      )
        .then((favs) => {
          res.status(200).json(favs);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async read(req, res) {
    const user = await UserSchema.findById(req.body.userID).populate("favs");
    res.status(200).json(user);
  }
  // async update(req, res) {
  //   const { favs, _id } = req.body;
  //   FavsSchema.findByIdAndUpdate(
  //     _id,
  //     {
  //       favs,
  //     },
  //     {},
  //     (err, favs) => {
  //       if (err) {
  //         res.status(500).json(err);
  //       }
  //       res.status(200).json(favs);
  //     },
  //   );
  // }
  async delete(req, res) {
    const { symbol, userID } = req.body;
    try {
      const user = await UserSchema.findById(userID).populate("favs");
      const favs = await FavsSchema.findById(user.favs._id);
      const newFavs = favs.favs.filter((fav) => fav !== symbol);
      FavsSchema.findByIdAndUpdate(
        user.favs._id,
        {
          favs: newFavs,
        },
        { new: true },
      ).then((favs) => {
        res.status(200).json(favs);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = new FavsController()