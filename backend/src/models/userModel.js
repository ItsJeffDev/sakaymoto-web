const db = require("../config/db");
const express = require("express");
const router = express.Router();

const {
    register,
    login
} = require("../controllers/authController");


const getAllUsers = async () => {
    const [results] = await db.query("SELECT * FROM users");
    return results;
};

// Register
router.post("/register", register);


// Login
router.post("/login", login);


module.exports = {
    getAllUsers,
    router
};

