import { InferenceClient } from "@huggingface/inference";
/**
 * Create embeddings for text using Hugging Face inference API
 * @param {string} text - The text to create embeddings for
 * @returns {Promise<number[]>} - Array of numbers representing the embedding
 */
export async function createEmbedding(text) {
    const client = new InferenceClient(process.env.HF_TOKEN || "");

    try {
        const embedding = await client.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: text,
        });
        return embedding;
    } catch (error) {
        console.error("🔴 Error creating embedding:", error);
        throw new Error(`Failed to create embedding: ${error.message}`);
    }
}
