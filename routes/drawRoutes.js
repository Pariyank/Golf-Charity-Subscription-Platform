const express = require("express");
const router = express.Router();

const { runDraw, getDraws } = require("../controllers/drawController");
const { protect } = require("../middleware/authMiddleware");

// Admin only later (for now protected)
router.post("/run", protect, runDraw);
router.get("/", protect, getDraws);

module.exports = router;