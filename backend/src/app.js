const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const motorcycleRoutes = require("./routes/motorcycleRoutes");

const app = express();


// ============================
// MIDDLEWARE
// ============================

app.use(cors());

app.use(express.json());

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
