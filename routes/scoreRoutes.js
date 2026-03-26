const express = require("express");
const router = express.Router();
const { addScore, getScores, deleteScore, editScore } = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addScore);
router.get("/", protect, getScores);
router.delete("/", protect, deleteScore);
router.put("/", protect, editScore);

module.exports = router;