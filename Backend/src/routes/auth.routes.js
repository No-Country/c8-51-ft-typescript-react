const { Router } = require('express')
const AuthController = require('../controllers/auth.controller')
const router = Router()

router.get('/register', AuthController.register)

router.post('/login', AuthController.login)

module.exports = router
