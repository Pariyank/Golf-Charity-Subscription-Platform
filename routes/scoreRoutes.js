const express = require("express");
const router = express.Router();
const { 
  addScore, 
  getScores, 
  deleteScore, 
  editScore 
} = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");

// All score routes are protected
router.get("/", protect, getScores);
router.post("/add", protect, addScore);
router.delete("/:id", protect, deleteScore);
router.put("/:id", protect, editScore);

module.exports = router;