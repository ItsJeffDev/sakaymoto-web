const express = require("express");

const {
  getMotorcycles,
} = require("../controllers/motorcycleController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMotorcycles);

module.exports = router;