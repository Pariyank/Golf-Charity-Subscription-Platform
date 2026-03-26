const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected by the JWT check
router.get("/", protect, scoreController.getScores);
router.post("/add", protect, scoreController.addScore);

// Use :id for specific score management (Requirement 11)
router.delete("/:id", protect, scoreController.deleteScore);
router.put("/:id", protect, scoreController.editScore);

module.exports = router;