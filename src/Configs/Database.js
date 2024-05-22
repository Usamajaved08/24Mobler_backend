import mongoose from "mongoose";
import 'dotenv/config';
const { MONGO_URL } = process.env;

const setupDatabase = async () => {
    try {
        if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
            await mongoose.connect(MONGO_URL);
            console.info("INFO - MongoDB Database connected.");
        }
    } catch (err) {
        console.error("ERROR - Unable to connect to the database:", err);
    }
};
export { setupDatabase };
