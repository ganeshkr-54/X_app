import mongoose from "mongoose";
import CONFIG from "../config/config.js";

async function dbConnect() {
    try {
        // Use MONGODB_URI from environment variables or construct it from CONFIG
        const dbURI = process.env.MONGODB_URI || `${CONFIG.MONGO_DB_URL}/${CONFIG.DB_NAME}`;
        
        console.log("Attempting to connect to MongoDB at:", dbURI);

        // Connect to MongoDB with additional options
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,   // Use new URL parser
            useUnifiedTopology: true, // Use the new unified topology engine
        });

        console.log("✅ MongoDB connected successfully.");
    } catch (error) {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
        process.exit(1); // Exit the process if DB connection fails
    }
}

export { dbConnect };
