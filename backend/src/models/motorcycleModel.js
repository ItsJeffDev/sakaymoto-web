const db = require("../config/db");

const getAllMotorcycles = async (status = 'available') => {
  const query = status === 'all'
    ? "SELECT * FROM motorcycles ORDER BY created_at DESC"
    : "SELECT * FROM motorcycles WHERE status = ? ORDER BY created_at DESC";
  const [motorcycles] = await db.query(query, status === 'all' ? [] : [status]);

  return motorcycles;
};

module.exports = {
  getAllMotorcycles,
};
