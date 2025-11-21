import mongoose from "mongoose";

const canteenItemsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        ingredients: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        preparation_time: {
            type: Number,
            required: true,
        },
        embeddings: {
            type: [Number],
            required: false,
        },
    },
    {
        timestamps: true,
        skipVersioning: true,
    }
);

export const CanteenItem = mongoose.model("CanteenItem", canteenItemsSchema);
