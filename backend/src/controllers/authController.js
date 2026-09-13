const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ============================
// REGISTER
// ============================
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const normalizedName = String(name || '').trim();

        // Validate input
        if (!normalizedName || !normalizedEmail || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Check if email already exists
        const [existingUser] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [normalizedEmail]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert user
        const [result] = await db.execute(
            `INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, 'customer')`,
            [
                normalizedName,
                normalizedEmail,
                hashedPassword
            ]
        );

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: result.insertId,
                name: normalizedName,
                email: normalizedEmail,
                role: "customer"
            }
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ============================
// LOGIN
// ============================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const [users] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Compare entered password with bcrypt hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "15m"
            }
        );

        // Send response
        res.status(200).json({
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    register,
    login
};
