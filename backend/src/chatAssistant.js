import { InferenceClient } from "@huggingface/inference";
import { tools } from "./tools/tools.js";
import { executeTool } from "./tools/toolExecutor.js";
import { Chat } from "./chatSchema.js";

// Available tools:
//                     - get_all_dishes: Get a list of all available dishes with basic details.
//                     - get_vegetarian_dishes: Get vegetarian dish options.
//                     - get_non_vegetarian_dishes: Get non-vegetarian (meat) dish options.
//                     - get_dishes_by_cuisine: Get dishes filtered by cuisine type (North Indian, South Indian, etc.).
//                     - get_popular_dishes: Get the most popular and trending dishes.
// - get_user_profile: Retrieve user's profile, dietary preferences, and settings.
// - update_user_profile: Update user's name, phone, dietary preferences, or spice level.

/*
  What each role means:
  - 'system': Sets the AI's behavior and personality (appears once at the start)
  - 'user': Messages from the user asking questions or giving input
  - 'assistant': Messages from the AI (previous responses in conversation history)
*/
async function chatAssistant(userId) {
    const client = new InferenceClient(process.env.HF_TOKEN);

    const historyMessages = await Chat.find({ userId: userId }).sort("createdAt");
    const formattedHistory = historyMessages.map(({ role, text }) => ({ role: role, content: text }));

    const messages = [
        {
            role: "system",
            content: `
                    You are a helpful canteen assistant for user ID: ${userId}. 
                    You help users with questions about dishes, their preferences, and canteen matters. 
                    Be friendly and conversational and keep responses short.

                    You have some available tools.

                    If the user's request doesn't match any available tool, reply naturally 
                    and helpfully with general information.
                `,
        },
        ...formattedHistory,
    ];

    const response = await client.chatCompletion({
        model: "meta-llama/Llama-3.1-70B-Instruct",
        messages: messages,
        tools: tools,
        tool_choice: "auto",
        max_tokens: 5000,
        temperature: 0.3,
    });

    console.log("🔵🔵 chatCompletion response 🔵🔵");

    const choice = response.choices[0];
    const finishReason = choice.finish_reason;

    console.log("🟡 : choice:", choice);
    console.log("🤖 Tool calls:", choice.message.tool_calls);

    // If the model returned text (not a tool call), return it
    if (finishReason === "stop" || finishReason === "length") {
        console.log("✅ AI response is ready (text response)");
        return choice.message.content || "I couldn't generate a response.";
    }

    // If the model wants to call a tool
    if (finishReason === "tool_calls") {
        const toolCalls = choice.message.tool_calls;

        if (!toolCalls || toolCalls.length === 0) {
            console.log("✅ AI response is ready (no tool calls)");
            return choice.message.content || "I couldn't generate a response.";
        }

        // Execute each tool call and collect results
        let toolResultsText = "";

        for (const toolCall of toolCalls) {
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments);
            console.log(`🔧 Executing tool: ${toolName}`, toolArgs);
            const toolResult = await executeTool(toolName, toolArgs);
            toolResultsText += `\n\nTool: ${toolName}\nResult:\n${toolResult}`;
        }

        console.log("🔧 Tool results collected, asking LLM to format response");

        // Now ask the LLM to format a natural response based on the tool results
        const followUpMessages = [
            ...messages,
            {
                role: "assistant",
                content: choice.message.content || "I found some information for you.",
            },
            {
                role: "user",
                content: `Based on the following data, please provide a helpful response to the user's question:\n${toolResultsText}`,
            },
        ];

        const followUpResponse = await client.chatCompletion({
            model: "meta-llama/Llama-3.1-70B-Instruct",
            messages: followUpMessages,
            max_tokens: 5000,
            temperature: 0.3,
        });

        const followUpChoice = followUpResponse.choices[0];
        console.log("✅ AI response with tool results ready");
        return followUpChoice.message.content || "I found the information but couldn't format it properly.";
    } else {
        // Unexpected finish reason
        console.log("🔴 🔴 Unexpected finish reason:", finishReason);
        return choice.message.content || "I couldn't generate a response.";
    }
}

export { chatAssistant };
