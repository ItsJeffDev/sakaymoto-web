const db = require("../config/db");

const getAllMotorcycles = async () => {
  const [motorcycles] = await db.query(
    "SELECT * FROM motorcycles"
  );

  return motorcycles;
};

module.exports = {
  getAllMotorcycles,
};
