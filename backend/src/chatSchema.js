import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        skipVersioning: true,
    }
);

export const Chat = mongoose.model("Chat", chatSchema);
