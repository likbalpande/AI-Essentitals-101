import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "ai-101-chat-app",
        });
        console.log("--------- ✅ MongoDB connected successfully");
    } catch (error) {
        console.error("-------- 🔴 MongoDB connection failed:", error.message);
        process.exit(1);
    }
};
