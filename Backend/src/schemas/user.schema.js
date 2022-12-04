const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  portfolio_id: { type: Schema.Types.ObjectId, require: false, ref: "Portfolio" },
  favs_id: { type: Schema.Types.ObjectId, require: false, ref: "Favs" },
  address_id: { type: Schema.Types.ObjectId, require: false, ref: "Address" }
},
 {
  toJSON: {
    transform(doc, ret) {
      ret.password = undefined;
      ret.__v = undefined;
    }
  }
}
)

module.exports = model('User', UserSchema)