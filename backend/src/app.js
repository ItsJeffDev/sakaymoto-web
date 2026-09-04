const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
// const motorcycleRoutes = require("./routes/motorcycleRoutes");

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

// Your motorcycle routes
// app.use("/api/motorcycles", motorcycleRoutes);


// ============================
// TEST ROUTE
// ============================

app.get("/", (req, res) => {
    res.json({
        message: "API is running"
    });
});


module.exports = app;
