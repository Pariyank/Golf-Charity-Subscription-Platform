const express = require("express");
const router = express.Router();

const {
  uploadProof,
  verifyWinner,
  markPaid,
} = require("../controllers/winnerController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/upload-proof", protect, upload.single("proof"), uploadProof);
router.post("/verify", protect, verifyWinner);
router.post("/mark-paid", protect, markPaid);

module.exports = router;