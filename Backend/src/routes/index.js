const { Router } = require('express')
const authRoutes = require('./auth.routes')
const portfolioRoutes = require('./portfolio.routes')
const favsRoutes = require('./favs.routes')
const router = Router()

router.use('/auth', authRoutes)
router.use('/portfolio', portfolioRoutes)
router.use('/favs', favsRoutes)

module.exports = router