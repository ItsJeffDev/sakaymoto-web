const db = require("../config/db");
const { getAllUsers } = require("../models/userModel");

const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

const getProfile = async (req, res) => {
    const [rows] = await db.execute(
        "SELECT id, name, email, role, phone, address, profile_image, created_at, updated_at FROM users WHERE id = ?",
        [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    return res.json({ data: rows[0] });
};

const updateProfile = async (req, res) => {
    const normalizedName = String(req.body.name || '').trim();

    if (!normalizedName) {
        return res.status(400).json({ message: "Name is required" });
    }

    const updates = ["name = ?"];
    const values = [normalizedName];

    const phone = req.body.phone ? String(req.body.phone).trim() : null;
    const address = req.body.address ? String(req.body.address).trim() : null;

    updates.push("phone = ?");
    values.push(phone);

    updates.push("address = ?");
    values.push(address);

    if (req.file) {
        updates.push("profile_image = ?");
        values.push(`/uploads/users/profile/${req.file.filename}`);
    }

    values.push(req.user.id);

    await db.execute(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        values
    );

    return getProfile(req, res);
};

const updateUserStatus = async (req, res) => {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) return res.status(400).json({ message: "Invalid role" });
    const [result] = await db.execute("UPDATE users SET role = ? WHERE id = ?", [role, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User updated" });
};

module.exports = {
    getUsers,
    getProfile,
    updateProfile,
    updateUserStatus,
};
