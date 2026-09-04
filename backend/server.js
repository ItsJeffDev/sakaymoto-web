require("dotenv").config();
require("./src/middleware/upload");

const app = require("./src/app");
const db = require("./src/config/db");

const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 
=======

// Test database connection
const startServer = async () => {
    try {

        const connection = await db.getConnection();

        console.log("MySQL connected");

        connection.release();

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });

    } catch (error) {

        console.error(
            "Database connection failed:",
            error.message
        );

        process.exit(1);
    }
};


startServer();
>>>>>>> 511ca6d (added jwt and setup backend)
