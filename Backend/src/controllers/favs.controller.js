const FavsSchema = require('../schemas/favs.schema')
const UserSchema = require('../schemas/user.schema')
class FavsController {
  async create(req, res) {
    const { symbol, userID } = req.body;
    try {
      // Find the user by ID, and ensure that the `favs_id` field exists and references a valid document in the `Favs` collection
      const user = await UserSchema.findById(userID).populate('favs_id');

      // Get the favs document that is referenced by the `favs_id` field in the user document

      console.log(user)
      if (user.favs_id ) {
        const favs = user.favs_id;
        // check if the symbol is already in the favs array
        if (favs.favs.includes(symbol)) {
          return res.status(400).json({ message: 'Symbol already in favs' })
        }
        // Add the new symbol to the list of favs
        favs.favs.push(symbol);

        // Save the updated favs document to the database
        await favs.save();
        await user.save();

        // Send the updated favs document as the response
        res.status(200).json(favs);
      } else {
        const newFavs = new FavsSchema({ favs: [symbol] });
        await newFavs.save();
        user.favs_id = newFavs._id;
        await user.save();
        res.status(200).json(newFavs);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
  async read(req, res) {
    try {
      const user = await UserSchema.findById(req.body.userID).populate("favs_id"); // update the collection name here
      res.status(200).json(user);
    } catch (err) {
      console.log(err)
    }
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
      const user = await UserSchema.findById(userID).populate("favs_id");
      console.log(user)
      const favs = user.favs_id.favs;
      console.log(favs)
      const newFavs = favs.filter((fav) => fav !== symbol);
      FavsSchema.findByIdAndUpdate(
        user.favs_id._id,
        {
          favs: newFavs,
        },
        { new: true },
      ).then((favs) => {
        res.status(200).json(favs);
      });
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  }
}

module.exports = new FavsController()