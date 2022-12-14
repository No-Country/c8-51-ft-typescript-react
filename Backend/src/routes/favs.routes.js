const { Router } = require("express");
const FavsController = require("../controllers/favs.controller");
const router = Router();

router.post('/create', FavsController.create)
router.post('/read', FavsController.read)
router.post('/delete', FavsController.delete)

module.exports = router;
