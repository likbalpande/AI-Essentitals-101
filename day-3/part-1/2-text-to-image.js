import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

async function saveImage(image) {
    const outputDir = path.join(process.cwd(), "image-outputs");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`📁 Created image-outputs folder`);
    }

    // Convert blob to buffer and save
    const buffer = Buffer.from(await image.arrayBuffer());
    const timestamp = Date.now();
    const filename = `img-${timestamp}.jpeg`;
    const filePath = path.join(outputDir, filename);

    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Image saved to: ${filePath}`);
    console.log(`📦 File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
}

async function main() {
    const client = new InferenceClient(process.env.HF_TOKEN);

    const image = await client.textToImage({
        provider: "nscale",
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: "Cat and dog sat on mat.",
        parameters: { num_inference_steps: 25 },
    });

    console.log("🟡 : image:", image);

    saveImage(image);
}

main().catch(console.log);
