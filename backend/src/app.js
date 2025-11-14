import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

import express from "express";
import { Chat } from "./chatSchema.js";
import { connectDB } from "./dbConfig.js";

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
    const { text, userId } = req.body;

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
});

app.listen(3124, () => {
    console.log("-------- Server Started ----------");
});
