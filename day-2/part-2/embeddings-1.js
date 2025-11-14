import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("<token>");

async function createEmbedding(text) {
    const embedding = await client.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: text,
    });
    return embedding;
}

async function main() {
    const text = "Car";
    const embedding = await createEmbedding(text);
    console.log(`Text: "${text}"`);
    console.log(`Embedding dimension: ${embedding.length}`);
    console.log(`Embedding:`, embedding);
}

main().catch((err) => {
    console.error("🔴 🔴 🔴 Error creating embedding -->", err);
});
