const { Router } = require("express");
const FavsController = require("../controllers/favs.controller");
const router = Router();

router.post("/", FavsController.create);
router.get("/", FavsController.read);
router.delete("/", FavsController.delete);

module.exports = router;
