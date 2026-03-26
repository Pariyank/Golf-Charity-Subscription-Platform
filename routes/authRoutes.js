const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Manual Auth
router.post("/register", authController.register);
router.post("/login", authController.login);

// Google/Firebase Auth
router.post("/firebase-login", authController.firebaseLogin);

// Profile logic (Used by Frontend Navbar to show profile icon)
router.get("/me", protect, authController.getMe);

module.exports = router;