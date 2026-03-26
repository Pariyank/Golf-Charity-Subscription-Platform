const express = require("express");
const router = express.Router();
const { 
  runDraw, 
  getDraws, 
  getUserWinnings 
} = require("../controllers/drawController");

// IMPORTANT: Destructure BOTH protect and authorize here
const { protect, authorize } = require("../middleware/authMiddleware");

// Admin Only: Run Draw
router.post("/run", protect, authorize("admin"), runDraw);

// Admin Only: View all draws
router.get("/", protect, authorize("admin"), getDraws);

// Subscriber/Admin: View personal winnings
router.get("/user-winnings", protect, getUserWinnings);

module.exports = router;