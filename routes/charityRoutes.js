const express = require("express");
const router = express.Router();
const {
  getCharities,
  getFeatured,
  selectCharity
} = require("../controllers/charityController");
const { protect } = require("../middleware/authMiddleware");

// Public routes (Requirement 03: Public Visitor role)
router.get("/", getCharities);
router.get("/featured", getFeatured);

// Protected routes (Requirement 08: Subscriber selection)
router.post("/select", protect, selectCharity);

module.exports = router;