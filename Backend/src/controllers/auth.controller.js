const UserSchema = require("../schemas/user.schema")
class AuthController {

    async register(req, res) {
        const user = new UserSchema(req.body)
        return await user.save();
    }

    async login(req, res) {

    }
}

module.exports = new AuthController() 