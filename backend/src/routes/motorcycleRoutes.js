const express = require('express');
const { getMotorcycles, getMotorcycle, createMotorcycle, updateMotorcycle, deleteMotorcycle, addMotorcycleImage } = require('../controllers/motorcycleController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { motorcycleUpload } = require('../middleware/upload');

const router = express.Router();

router.get('/', getMotorcycles);
router.get('/:id', getMotorcycle);
router.post('/', authenticate, requireAdmin, createMotorcycle);
router.patch('/:id', authenticate, requireAdmin, updateMotorcycle);
router.delete('/:id', authenticate, requireAdmin, deleteMotorcycle);
router.post('/:id/images', authenticate, requireAdmin, motorcycleUpload.single('image'), addMotorcycleImage);

module.exports = router;
