const db = require("../config/db");

const num = (value) => Number(value) || 0;

const getSummary = async (req, res) => {
  const [[summary]] = await db.query(
    `SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'customer') AS customers,
      (SELECT COUNT(*) FROM motorcycles WHERE status <> 'inactive') AS motorcycles,
      (SELECT COUNT(*) FROM bookings WHERE status IN ('pending', 'confirmed')) AS active_bookings,
      (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'verified') AS verified_revenue,
      (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'pending') AS pending_payments,
      (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'refunded') AS refunded_amount,
      (SELECT COUNT(*) FROM payments WHERE status = 'verified') AS verified_payment_count,
      (SELECT COUNT(*) FROM payments WHERE status = 'pending') AS pending_payment_count,
      (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status IN ('confirmed', 'completed')) AS booked_value,
      (SELECT COALESCE(SUM(GREATEST(b.total_price - COALESCE(v.paid, 0), 0)), 0)
         FROM bookings b
         LEFT JOIN (SELECT booking_id, SUM(amount) AS paid FROM payments WHERE status = 'verified' GROUP BY booking_id) v
           ON v.booking_id = b.id
         WHERE b.status IN ('confirmed', 'completed')) AS outstanding_balance,
      (SELECT COUNT(*) FROM bookings) AS total_bookings,
      (SELECT COALESCE(AVG(rating), 0) FROM reviews) AS average_rating,
      (SELECT COUNT(*) FROM reviews) AS review_count`,
  );

  const [bookingBreakdown] = await db.query(
    "SELECT status, COUNT(*) AS count FROM bookings GROUP BY status",
  );

  // Last 12 months that actually have verified revenue, oldest -> newest.
  const [monthlyRows] = await db.query(
    `SELECT DATE_FORMAT(paid_at, '%Y-%m') AS month, SUM(amount) AS total, COUNT(*) AS payments
       FROM payments
      WHERE status = 'verified' AND paid_at IS NOT NULL
      GROUP BY DATE_FORMAT(paid_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12`,
  );
  const monthlyRevenue = monthlyRows
    .reverse()
    .map((row) => ({ month: row.month, total: num(row.total), payments: num(row.payments) }));

  const [paymentMethods] = await db.query(
    `SELECT payment_method AS method, COUNT(*) AS count, SUM(amount) AS total
       FROM payments WHERE status = 'verified'
      GROUP BY payment_method ORDER BY total DESC`,
  );

  const [paymentStatus] = await db.query(
    `SELECT status, COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total
       FROM payments GROUP BY status`,
  );

  const [topMotorcycles] = await db.query(
    `SELECT m.id, m.brand, m.model, m.plate_number,
            COUNT(DISTINCT b.id) AS bookings,
            COALESCE(SUM(CASE WHEN p.status = 'verified' THEN p.amount END), 0) AS revenue
       FROM motorcycles m
       LEFT JOIN bookings b ON b.motorcycle_id = m.id AND b.status IN ('confirmed', 'completed')
       LEFT JOIN payments p ON p.booking_id = b.id
      GROUP BY m.id
      ORDER BY revenue DESC, bookings DESC
      LIMIT 5`,
  );

  const [fleetRows] = await db.query(
    `SELECT m.status,
            EXISTS (SELECT 1 FROM bookings bk
                     WHERE bk.motorcycle_id = m.id AND bk.status = 'confirmed'
                       AND CURDATE() BETWEEN bk.start_date AND bk.end_date) AS rented
       FROM motorcycles m`,
  );
  const fleet = {
    total: fleetRows.length,
    available: 0,
    rented: 0,
    maintenance: 0,
    inactive: 0,
  };
  for (const bike of fleetRows) {
    if (bike.status === "available") {
      if (Number(bike.rented)) fleet.rented += 1;
      else fleet.available += 1;
    } else if (bike.status === "maintenance") fleet.maintenance += 1;
    else if (bike.status === "inactive") fleet.inactive += 1;
  }
  // Utilization = share of in-service bikes (not inactive) that are out on rent.
  const inService = fleet.total - fleet.inactive;
  fleet.utilization = inService ? Math.round((fleet.rented / inService) * 100) : 0;

  const [recentPayments] = await db.query(
    `SELECT p.id, p.amount, p.payment_method, p.status, p.paid_at, p.created_at,
            u.name AS customer_name, m.brand, m.model
       FROM payments p
       JOIN bookings b ON b.id = p.booking_id
       JOIN users u ON u.id = b.user_id
       JOIN motorcycles m ON m.id = b.motorcycle_id
      ORDER BY p.created_at DESC LIMIT 5`,
  );

  const verifiedCount = num(summary.verified_payment_count);
  return res.json({
    data: {
      ...summary,
      customers: num(summary.customers),
      motorcycles: num(summary.motorcycles),
      active_bookings: num(summary.active_bookings),
      verified_revenue: num(summary.verified_revenue),
      pending_payments: num(summary.pending_payments),
      refunded_amount: num(summary.refunded_amount),
      booked_value: num(summary.booked_value),
      outstanding_balance: num(summary.outstanding_balance),
      average_rating: Number(num(summary.average_rating).toFixed(1)),
      average_payment: verifiedCount ? num(summary.verified_revenue) / verifiedCount : 0,
      bookingBreakdown: bookingBreakdown.map((r) => ({ status: r.status, count: num(r.count) })),
      monthlyRevenue,
      paymentMethods: paymentMethods.map((r) => ({
        method: r.method,
        count: num(r.count),
        total: num(r.total),
      })),
      paymentStatus: paymentStatus.map((r) => ({
        status: r.status,
        count: num(r.count),
        total: num(r.total),
      })),
      topMotorcycles: topMotorcycles.map((r) => ({
        ...r,
        bookings: num(r.bookings),
        revenue: num(r.revenue),
      })),
      fleet,
      recentPayments,
    },
  });
};

module.exports = { getSummary };
