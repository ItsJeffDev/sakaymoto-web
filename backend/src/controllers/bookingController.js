const db = require('../config/db');

const bookingSelect = `
  SELECT b.*, m.brand, m.model, m.plate_number, u.name AS customer_name, u.email AS customer_email,
    p.id AS payment_id, p.payment_method, p.amount AS payment_amount, p.status AS payment_status
  FROM bookings b
  JOIN motorcycles m ON m.id = b.motorcycle_id
  JOIN users u ON u.id = b.user_id
  LEFT JOIN payments p ON p.booking_id = b.id
`;

const getBookings = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const [rows] = await db.execute(`${bookingSelect} ${isAdmin ? '' : 'WHERE b.user_id = ?'} ORDER BY b.created_at DESC`, isAdmin ? [] : [req.user.id]);
  return res.json({ data: rows });
};

const getBooking = async (req, res) => {
  const [rows] = await db.execute(`${bookingSelect} WHERE b.id = ?`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Booking not found' });
  if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'You cannot access this booking' });
  return res.json({ data: rows[0] });
};

const createBooking = async (req, res) => {
  const { motorcycle_id, start_date, end_date } = req.body;
  if (!motorcycle_id || !start_date || !end_date) return res.status(400).json({ message: 'Motorcycle and rental dates are required' });
  if (new Date(end_date) < new Date(start_date)) return res.status(400).json({ message: 'End date must be on or after start date' });
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [motorcycles] = await connection.execute('SELECT id, price_per_day, status FROM motorcycles WHERE id = ? FOR UPDATE', [motorcycle_id]);
    if (!motorcycles.length) return connection.rollback().then(() => res.status(404).json({ message: 'Motorcycle not found' }));
    if (motorcycles[0].status !== 'available') return connection.rollback().then(() => res.status(409).json({ message: 'Motorcycle is not available' }));
    const [conflicts] = await connection.execute(`SELECT id FROM bookings WHERE motorcycle_id = ? AND status IN ('pending', 'confirmed') AND start_date <= ? AND end_date >= ? FOR UPDATE`, [motorcycle_id, end_date, start_date]);
    if (conflicts.length) return connection.rollback().then(() => res.status(409).json({ message: 'Motorcycle is already booked for those dates' }));
    const days = Math.floor((new Date(end_date) - new Date(start_date)) / 86400000) + 1;
    const total = Number(motorcycles[0].price_per_day) * days;
    const [result] = await connection.execute('INSERT INTO bookings (user_id, motorcycle_id, start_date, end_date, price_per_day, total_price) VALUES (?, ?, ?, ?, ?, ?)', [req.user.id, motorcycle_id, start_date, end_date, motorcycles[0].price_per_day, total]);
    await connection.commit();
    return res.status(201).json({ id: result.insertId, total_price: total, message: 'Booking request submitted' });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid booking status' });
  const [result] = await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Booking not found' });
  return res.json({ message: 'Booking status updated' });
};

module.exports = { getBookings, getBooking, createBooking, updateBookingStatus };
