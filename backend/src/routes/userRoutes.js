const express = require("express");
const router = express.Router();
const {
  getUsers,
  updateProfile,
  getProfile,
  getUserById,
  updateUserStatus,
} = require("../controllers/userController");
const {
  authenticate,
  requireAdmin,
  requireUserAccess,
} = require("../middleware/authMiddleware");
const { profileUpload } = require("../middleware/upload");

router.get("/me", authenticate, getProfile);
router.patch(
  "/me",
  authenticate,
  profileUpload.single("profile_image"),
  updateProfile,
);
router.get("/", authenticate, requireAdmin, getUsers);
router.get("/:id", authenticate, requireUserAccess, getUserById);
router.patch("/:id/status", authenticate, requireAdmin, updateUserStatus);
router.patch("/:id", authenticate, requireUserAccess, updateProfile);

module.exports = router;
