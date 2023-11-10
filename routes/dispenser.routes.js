const dispenser = require("../controllers/dispenser.controller.js");
const { Router } = require('express');
const router = Router();

router.post("/", dispenser.create);
router.put("/:dispenserId", dispenser.status);
router.get("/:dispenserId", dispenser.spending);

module.exports = router;