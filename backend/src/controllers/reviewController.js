const db = require('../config/db');

const getReviews = async (req, res) => {
  const [rows] = await db.execute('SELECT r.*, u.name AS customer_name FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.motorcycle_id = ? ORDER BY r.created_at DESC', [req.params.motorcycleId]);
  return res.json({ data: rows });
};

const createReview = async (req, res) => {
  const { motorcycle_id, booking_id, rating, comment } = req.body;
  if (!motorcycle_id || !booking_id || !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) return res.status(400).json({ message: 'Motorcycle, completed booking, and rating from 1 to 5 are required' });
  const [bookings] = await db.execute("SELECT id FROM bookings WHERE id = ? AND user_id = ? AND motorcycle_id = ? AND status = 'completed'", [booking_id, req.user.id, motorcycle_id]);
  if (!bookings.length) return res.status(400).json({ message: 'Only your completed bookings can be reviewed' });
  const [existing] = await db.execute('SELECT id FROM reviews WHERE booking_id = ?', [booking_id]);
  if (existing.length) return res.status(409).json({ message: 'This booking has already been reviewed' });
  const [result] = await db.execute('INSERT INTO reviews (user_id, motorcycle_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)', [req.user.id, motorcycle_id, booking_id, rating, comment || null]);
  return res.status(201).json({ id: result.insertId, message: 'Review submitted' });
};

module.exports = { getReviews, createReview };
