const express = require("express");
const router = express.Router();
const { 
  addScore, 
  getScores, 
  deleteScore, 
  editScore 
} = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");
const { requireActiveSubscription } = require("../middleware/subscriptionMiddleware");

// All score routes are protected
router.get("/", protect, getScores);
router.post("/add", protect, addScore);
router.delete("/:id", protect, deleteScore);
router.put("/:id", protect, editScore);
router.post("/add", protect, requireActiveSubscription, addScore);

module.exports = router;