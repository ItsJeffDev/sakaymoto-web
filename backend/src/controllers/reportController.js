const db = require('../config/db');

const getSummary = async (req, res) => {
  const [[summary]] = await db.query(`SELECT (SELECT COUNT(*) FROM users WHERE role = 'customer') AS customers, (SELECT COUNT(*) FROM motorcycles WHERE status <> 'inactive') AS motorcycles, (SELECT COUNT(*) FROM bookings WHERE status IN ('pending', 'confirmed')) AS active_bookings, (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'verified') AS verified_revenue`);
  const [bookingBreakdown] = await db.query('SELECT status, COUNT(*) AS count FROM bookings GROUP BY status');
  const [monthlyRevenue] = await db.query(`SELECT DATE_FORMAT(paid_at, '%Y-%m') AS month, SUM(amount) AS total FROM payments WHERE status = 'verified' AND paid_at IS NOT NULL GROUP BY DATE_FORMAT(paid_at, '%Y-%m') ORDER BY month DESC LIMIT 12`);
  return res.json({ data: { ...summary, bookingBreakdown, monthlyRevenue } });
};

module.exports = { getSummary };
