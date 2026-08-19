const db = require("../config/db");

const getMotorcycles = async (req, res) => {
  try {
    const [motorcycles] = await db.query(
      "SELECT * FROM motorcycles"
    );

    res.json(motorcycles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve motorcycles",
    });
  }
};

module.exports = {
  getMotorcycles,
};