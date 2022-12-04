const { Router } = require('express')
const authRoutes = require('./auth.routes')
const portfolioRoutes = require('./portfolio.routes')
const router = Router()

router.use('/auth', authRoutes)
router.use('/portfolio', portfolioRoutes)

module.exports = router