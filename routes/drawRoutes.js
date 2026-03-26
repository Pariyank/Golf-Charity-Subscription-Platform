const express = require("express");
const router = express.Router();
const { 
  runDraw, 
  getDraws, 
  getUserWinnings 
} = require("../controllers/drawController");


const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/run", protect, authorize("admin"), runDraw);

router.get("/", protect, authorize("admin"), getDraws);

router.get("/user-winnings", protect, getUserWinnings);

module.exports = router;