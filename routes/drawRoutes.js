const express = require("express");
const router = express.Router();
const { 
  runDraw, 
  getDraws, 
  getUserWinnings 
} = require("../controllers/drawController");
const { protect } = require("../middleware/authMiddleware");

// Admin/System Route
router.post("/run", protect, runDraw);

// Admin List Route
router.get("/", protect, getDraws);

// User Winnings Route (Requirement 10)
router.get("/user-winnings", protect, getUserWinnings);

router.post("/run", protect, authorize("admin"), runDraw);

module.exports = router;