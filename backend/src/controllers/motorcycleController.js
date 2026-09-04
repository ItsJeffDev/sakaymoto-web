const db = require("../config/db");
const { getAllMotorcycles } = require("../models/motorcycleModel");

const getMotorcycles = async (req, res) => {
  try {
    const motorcycles = await getAllMotorcycles();
    res.status(200).json(motorcycles);

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