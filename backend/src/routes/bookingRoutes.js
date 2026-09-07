const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { getBookings, getBooking, createBooking, updateBookingStatus } = require('../controllers/bookingController');

const router = express.Router();
router.use(authenticate);
router.get('/', getBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.patch('/:id/status', requireAdmin, updateBookingStatus);
module.exports = router;
