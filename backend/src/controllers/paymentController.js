const db = require('../config/db');

const getPayments = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const [rows] = await db.execute(`SELECT p.*, b.user_id, b.motorcycle_id, b.start_date, b.end_date, u.name AS customer_name FROM payments p JOIN bookings b ON b.id = p.booking_id JOIN users u ON u.id = b.user_id ${isAdmin ? '' : 'WHERE b.user_id = ?'} ORDER BY p.created_at DESC`, isAdmin ? [] : [req.user.id]);
  return res.json({ data: rows });
};

const createPayment = async (req, res) => {
  const { booking_id, payment_method, amount, reference_number } = req.body;
  if (!booking_id || !['cash', 'gcash', 'bank_transfer'].includes(payment_method) || Number(amount) <= 0) return res.status(400).json({ message: 'Valid booking, payment method, and amount are required' });
  const [bookings] = await db.execute('SELECT id, user_id, total_price FROM bookings WHERE id = ?', [booking_id]);
  if (!bookings.length) return res.status(404).json({ message: 'Booking not found' });
  if (req.user.role !== 'admin' && bookings[0].user_id !== req.user.id) return res.status(403).json({ message: 'You cannot pay for this booking' });
  if (Number(amount) > Number(bookings[0].total_price)) return res.status(400).json({ message: 'Payment cannot exceed booking total' });
  const [result] = await db.execute('INSERT INTO payments (booking_id, payment_method, amount, reference_number) VALUES (?, ?, ?, ?)', [booking_id, payment_method, amount, reference_number || null]);
  return res.status(201).json({ id: result.insertId, message: 'Payment submitted for verification' });
};

const updatePaymentStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'verified', 'rejected', 'refunded'].includes(status)) return res.status(400).json({ message: 'Invalid payment status' });
  const [result] = await db.execute('UPDATE payments SET status = ?, paid_at = CASE WHEN ? = "verified" THEN CURRENT_TIMESTAMP ELSE paid_at END WHERE id = ?', [status, status, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Payment not found' });
  return res.json({ message: 'Payment status updated' });
};

module.exports = { getPayments, createPayment, updatePaymentStatus };
