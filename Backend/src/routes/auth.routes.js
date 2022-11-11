const { Router } = require('express')
const AuthController = require('../controllers/auth.controller')
const router = Router()

router.get('/register', AuthController.register)

router.get('/login', AuthController.login)

module.exports = router
