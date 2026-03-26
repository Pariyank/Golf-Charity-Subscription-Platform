const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");


router.get("/", protect, scoreController.getScores);
router.post("/add", protect, scoreController.addScore);

router.delete("/:id", protect, scoreController.deleteScore);
router.put("/:id", protect, scoreController.editScore);

module.exports = router;