import mongoose from "mongoose";
import CONFIG from '../config/config.js';

const { MONGO_DB_URL, DB_NAME } = CONFIG;

async function dbConnect() {
    try {
        // Construct the connection URI
        const DB_URI = `${MONGO_DB_URL}/${DB_NAME}`;
        
        // Connect to MongoDB with additional options for better compatibility
        await mongoose.connect(DB_URI, {
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
