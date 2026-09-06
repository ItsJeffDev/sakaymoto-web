const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const motorcycleRoutes = require("./routes/motorcycleRoutes");

const app = express();
const userRoutes = require("./routes/userRoutes");


// ============================
// MIDDLEWARE
// ============================

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use(express.urlencoded({
    extended: true
}));


// ============================
// ROUTES
// ============================

app.use(
    "/api/auth",
    authRoutes
);

app.use("/api/motorcycles", motorcycleRoutes);

// ============================
// TEST ROUTE
// ============================

app.get("/", (req, res) => {
  res.json({
    message: "SakayMoto API is running",
  });
});


app.use("/users", userRoutes);

module.exports = app;
