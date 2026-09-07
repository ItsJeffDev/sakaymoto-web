const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { getPayments, createPayment, updatePaymentStatus } = require('../controllers/paymentController');

const router = express.Router();
router.use(authenticate);
router.get('/', getPayments);
router.post('/', createPayment);
router.patch('/:id/status', requireAdmin, updatePaymentStatus);
module.exports = router;
