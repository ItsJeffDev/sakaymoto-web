const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { getSummary } = require('../controllers/reportController');

const router = express.Router();
router.get('/summary', authenticate, requireAdmin, getSummary);
module.exports = router;
