const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { getRentals, updateRental, createRental } = require('../controllers/rentalController');

const router = express.Router();
router.use(authenticate, requireAdmin);
router.get('/', getRentals);
router.post('/', createRental);
router.patch('/:id', updateRental);
module.exports = router;
