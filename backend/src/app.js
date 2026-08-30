const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});


app.use("/users", userRoutes);

module.exports = app;