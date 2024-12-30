import { app } from "./app.js";
import { dbConnect } from "./src/db/dbConnect.js";

// Fetch port from environment or fallback to default (3000)
const PORT = process.env.PORT || 3000;

dbConnect()
    .then(() => {
        // Bind the application to all network interfaces (0.0.0.0) to make it accessible
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`✅ THS_X Server is running on Port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Failed to start the server due to database connection error:");
        console.error(error.message);
        process.exit(1); // Exit the process if database connection fails
    });
