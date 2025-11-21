import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

import express from "express";
import { Chat } from "./schemas/chatSchema.js";
import { connectDB } from "./dbConfig.js";
import { chatAssistant } from "./chatAssistant.js";
import { bulkInsertCanteenItems, searchCanteenItems } from "./services/canteenDishesServices.js";

connectDB();

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        isSuccess: true,
        message: "Server is running...",
    });
});

app.post("/messages", async (req, res) => {
    try {
        const { text, userId } = req.body;

        if (!text || !userId) {
            res.status(400).json({ isSuccess: false, message: "Sender and text are required" });
            return;
        }

        const newMessage = await Chat.create({
            text: text,
            userId: userId,
            role: "user",
        });

        res.json({
            isSuccess: true,
            message: "hello",
            data: {
                message: newMessage,
            },
        });

        try {
            const assistantReply = await chatAssistant(userId);

            await Chat.create({
                text: assistantReply,
                userId: userId,
                role: "assistant",
            });
        } catch (err) {
            console.log("🔴 Could not generate AI response", err);
        }
    } catch (error) {
        console.log("🔴 Error adding message:", error);
        res.status(500).json({ isSuccess: false, message: "Internal server error" });
    }
});

app.get("/messages/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ isSuccess: false, message: "userId is required" });
            return;
        }

        const messages = await Chat.find({ userId: userId });

        res.json({
            isSuccess: true,
            message: "Messages fetched!",
            data: {
                messages: messages,
            },
        });
    } catch (error) {
        console.log("🔴 Error adding message:", error);
        res.status(500).json({ isSuccess: false, message: "Internal server error" });
    }
});

app.post("/canteen-items/bulk-insert", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ isSuccess: false, message: "Items array is required" });
            return;
        }

        const result = await bulkInsertCanteenItems(items);

        res.json({
            isSuccess: true,
            message: "Bulk insertion completed",
            data: result,
        });
    } catch (error) {
        console.log("🔴 Error in bulk insertion:", error);
        res.status(500).json({ isSuccess: false, message: "Internal server error" });
    }
});

app.post("/canteen-items/search", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || query.trim().length === 0) {
            res.status(400).json({ isSuccess: false, message: "Search query is required" });
            return;
        }

        const results = await searchCanteenItems(query);

        res.json({
            isSuccess: true,
            message: "Search completed",
            data: {
                results: results,
                count: results.length,
            },
        });
    } catch (error) {
        console.log("🔴 Error in search:", error);
        res.status(500).json({ isSuccess: false, message: error.message || "Internal server error" });
    }
});

app.listen(3124, () => {
    console.log("-------- Server Started ----------");
});
