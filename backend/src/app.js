const express = require("express");
const cors = require("cors");

const motorcycleRoutes = require("./routes/motorcycleRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "SakayMoto API is running",
  });
});

app.use("/api/motorcycles", motorcycleRoutes);

module.exports = app;