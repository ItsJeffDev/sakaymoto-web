const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { documentUpload } = require('../middleware/upload');
const { getDocuments, uploadDocument, updateDocumentStatus } = require('../controllers/documentController');

const router = express.Router();
router.use(authenticate);
router.get('/', getDocuments);
router.post('/', documentUpload.single('document'), uploadDocument);
router.patch('/:id/status', requireAdmin, updateDocumentStatus);
module.exports = router;
