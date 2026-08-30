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

module.exports = {
    getUsers,
};
