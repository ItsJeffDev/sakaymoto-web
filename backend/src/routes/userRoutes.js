const express = require("express");
const router = express.Router();
const { getUsers, updateProfile, getProfile, updateUserStatus } = require("../controllers/userController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");
const { profileUpload } = require("../middleware/upload");

router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, profileUpload.single("profile_image"), updateProfile);
router.get("/", authenticate, requireAdmin, getUsers);
router.patch("/:id/status", authenticate, requireAdmin, updateUserStatus);

module.exports = router;