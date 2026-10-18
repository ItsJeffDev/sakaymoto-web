const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const motorcycleRoutes = require("./routes/motorcycleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const documentRoutes = require("./routes/documentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const userRoutes = require("./routes/userRoutes");

// ============================
// MIDDLEWARE
// ============================


// ============================
// MIDDLEWARE
// ============================

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ============================
// ROUTES
// ============================

app.use("/api/auth", authRoutes);

app.use("/api/motorcycles", motorcycleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);

// ============================
// TEST ROUTE
// ============================

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

app.use("/api/motorcycles", authRoutes, motorcycleRoutes);


// ============================
// TEST ROUTE
// ============================

app.get("/", (req, res) => {
    res.json({
        message: "API is running"
    });
});


module.exports = app;
