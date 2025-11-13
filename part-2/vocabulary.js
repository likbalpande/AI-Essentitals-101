import { encoding_for_model } from "tiktoken";
import fs from "fs";

// const enc = encoding_for_model("gpt-3.5-turbo");
const enc = encoding_for_model("gpt-5");

const vocabSize = enc.token_byte_values().length;
console.log("--> vocab size:", vocabSize);

const tokens = enc.token_byte_values();
const csv = ["token_id,token_text"];

for (let i = 0; i < tokens.length; i++) {
    const bytes = new Uint8Array(tokens[i]);
    const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    csv.push(`${i}, "${text}"`);
    console.log(`${i}, "${text}"`);
}

fs.writeFileSync("tokens.csv", csv.join("\n"));
console.log("--> CSV dumped to tokens.csv");

enc.free();
