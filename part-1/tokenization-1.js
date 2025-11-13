import { encoding_for_model } from "tiktoken";

const enc = encoding_for_model("gpt-5");

const tokenIds = enc.encode("I am good.");

console.log("🟡 : tokenIds:", tokenIds);

const tokens = [];

for (const id of tokenIds) {
    const text = new TextDecoder().decode(enc.decode([id]));
    tokens.push(text);
}

console.log("🟡 : tokens:", tokens);
