import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.json({
        isSuccess: true,
        message: "Server is running...",
    });
});

app.listen(3124, () => {
    console.log("-------- Server Started ----------");
});
