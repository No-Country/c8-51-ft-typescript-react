const { Schema, model } = require('mongoose')

const FavsSchema = new Schema({
  favs: { type: Array, require: true },
},
  {
    toJSON: {
      transform(doc, ret) {
        ret.__v = undefined;
      }
    }
  }
)

module.exports = model("Favs", FavsSchema)
