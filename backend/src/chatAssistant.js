import { OpenAI } from "openai";

/*
  What each role means:
  - 'system': Sets the AI's behavior and personality (appears once at the start)
  - 'user': Messages from the user asking questions or giving input
  - 'assistant': Messages from the AI (previous responses in conversation history)
*/
async function chatAssistant(text) {
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
                content: text,
            },
        ],
    });

    // console.log("🟡 : chatCompletion:", chatCompletion);

    console.log("AI response is ready ✅");
    console.log(chatCompletion.choices[0].message.content);
}

export { chatAssistant };
