import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const client = new OpenAI({
        baseURL: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
    });

    const chatCompletion = await client.chat.completions.create({
        model: "meta-llama/Llama-3.1-8B-Instruct:novita",
        messages: [
            {
                role: "system",
                content: "You are intelligent assistant.",
            },
            {
                role: "user",
                content: "When was the last terror attack done in delhi?",
            },
        ],
    });

    // console.log("🟡 : chatCompletion:", chatCompletion);

    console.log(chatCompletion.choices[0].message.content);
}

main().catch(console.log);
