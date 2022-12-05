const { Router } = require('express')
const PortfolioController = require('../controllers/portfolio.controller')
const router = Router()

router.post('/create', PortfolioController.create)
router.post('/read', PortfolioController.read)
router.post('/update', PortfolioController.update)
router.post('/delete', PortfolioController.delete)

module.exports = router
