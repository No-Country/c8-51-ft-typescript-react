const { Schema, model } = require('mongoose')

const FavsSchema = new Schema({
  favs: { type: Array, require: true },
  user_id: { type: Schema.Types.ObjectId, require: true, ref: "User" }
},
  {
  toJSON: {
    transform(doc, ret) {
      ret.__v = undefined;
    }
  }
}
)

module.exports = model('Favs', FavsSchema)
