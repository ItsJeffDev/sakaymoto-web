const db = require('../config/db');

const getDocuments = async (req, res) => {
  const userId = req.user.role === 'admin' && req.query.user_id ? req.query.user_id : req.user.id;
  const [rows] = await db.execute('SELECT * FROM user_documents WHERE user_id = ? ORDER BY uploaded_at DESC', [userId]);
  return res.json({ data: rows });
};

const uploadDocument = async (req, res) => {
  const { document_type, expiration_date } = req.body;
  if (!req.file || !['drivers_license', 'valid_id', 'other'].includes(document_type)) return res.status(400).json({ message: 'A valid document type and file are required' });
  const [result] = await db.execute('INSERT INTO user_documents (user_id, document_type, file_url, expiration_date) VALUES (?, ?, ?, ?)', [req.user.id, document_type, `/uploads/users/${req.file.filename}`, expiration_date || null]);
  return res.status(201).json({ id: result.insertId, message: 'Document uploaded for verification' });
};

const updateDocumentStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'verified', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid document status' });
  const [result] = await db.execute('UPDATE user_documents SET status = ?, verified_at = CASE WHEN ? = "verified" THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id = ?', [status, status, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Document not found' });
  return res.json({ message: 'Document status updated' });
};

module.exports = { getDocuments, uploadDocument, updateDocumentStatus };
