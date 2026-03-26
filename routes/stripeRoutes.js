const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/stripeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/checkout", protect, createCheckoutSession);

module.exports = router;