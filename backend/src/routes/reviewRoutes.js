const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { getReviews, createReview } = require('../controllers/reviewController');

const router = express.Router();
router.get('/motorcycle/:motorcycleId', getReviews);
router.post('/', authenticate, createReview);
module.exports = router;
