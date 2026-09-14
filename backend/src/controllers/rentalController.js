const db = require('../config/db');

const getRentals = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const [rows] = await db.execute(`SELECT rt.*, b.user_id, b.motorcycle_id, b.start_date, b.end_date, m.brand, m.model, u.name AS customer_name FROM rental_transactions rt JOIN bookings b ON b.id = rt.booking_id JOIN motorcycles m ON m.id = b.motorcycle_id JOIN users u ON u.id = b.user_id ${isAdmin ? '' : 'WHERE b.user_id = ?'} ORDER BY rt.created_at DESC`, isAdmin ? [] : [req.user.id]);
  return res.json({ data: rows });
};

const updateRental = async (req, res) => {
  const allowed = ['released_at', 'returned_at', 'mileage_out', 'mileage_in', 'fuel_out', 'fuel_in', 'notes', 'status'];
  const updates = Object.entries(req.body).filter(([key, value]) => allowed.includes(key) && value !== undefined);
  if (!updates.length) return res.status(400).json({ message: 'No changes supplied' });
  if (req.body.status && !['pending', 'ongoing', 'returned', 'cancelled'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid rental status' });
  const values = updates.map(([, value]) => value);
  values.push(req.params.id);
  const [result] = await db.execute(`UPDATE rental_transactions SET ${updates.map(([key]) => `\`${key}\` = ?`).join(', ')} WHERE id = ?`, values);
  if (!result.affectedRows) return res.status(404).json({ message: 'Rental transaction not found' });
  return res.json({ message: 'Rental transaction updated' });
};

const createRental = async (req, res) => {
  const { booking_id } = req.body;
  if (!booking_id) return res.status(400).json({ message: 'Booking is required' });
  const [result] = await db.execute('INSERT INTO rental_transactions (booking_id) VALUES (?)', [booking_id]);
  return res.status(201).json({ id: result.insertId, message: 'Rental transaction created' });
};

module.exports = { getRentals, updateRental, createRental };
