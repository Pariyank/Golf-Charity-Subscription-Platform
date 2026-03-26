const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/stripeController");
const { protect } = require("../middleware/authMiddleware");

// Route to start the payment process
router.post("/checkout", protect, createCheckoutSession);

module.exports = router;