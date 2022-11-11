const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    recovery_phrase: { type: String, require: true },
    portfolio_id: { type: Schema.Types.ObjectId, require: false, ref: "Portfolio" },
    notification_id: { type: Schema.Types.ObjectId, require: false, ref: "Notification" },
    address_id: { type: Schema.Types.ObjectId, require: false, ref: "Address" }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.__v;
        }
    }
})

module.exports = model('User', UserSchema)