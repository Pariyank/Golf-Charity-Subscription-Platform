const express = require("express");
const router = express.Router();

const {
  getCharities,
  getFeatured,
  selectCharity,
} = require("../controllers/charityController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getCharities);
router.get("/featured", getFeatured);
router.post("/select", protect, selectCharity);

module.exports = router;