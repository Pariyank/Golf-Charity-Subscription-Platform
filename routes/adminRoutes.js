const express = require("express");
const router = express.Router();

const {
  getUsers,
  deleteUser,
  addCharity,
  deleteCharity,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/users", protect, admin, getUsers);
router.post("/charity", protect, admin, addCharity);

router.get("/users", protect, getUsers);
router.delete("/user/:id", protect, deleteUser);

router.post("/charity", protect, addCharity);
router.delete("/charity/:id", protect, deleteCharity);

module.exports = router;