import { InferenceClient } from "@huggingface/inference";
import fs from "fs";
import path from "path";
import { PCA } from "ml-pca";

const client = new InferenceClient("<token>");

async function createEmbedding(text) {
    const embedding = await client.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: text,
    });
    return embedding;
}

function plotGraphUsingPCA(embeddings, texts, filePathForPlot) {
    // Use ml-pca library
    const pca = new PCA(embeddings);
    const reduced2DMatrix = pca.predict(embeddings, 2);

    // Convert Matrix to array
    const reduced2D = reduced2DMatrix.to2DArray ? reduced2DMatrix.to2DArray() : reduced2DMatrix;

    // Prepare data for Plotly
    const xData = reduced2D.map((point) => point[0]);
    const yData = reduced2D.map((point) => point[1]);

    // Create HTML with Plotly
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Embedding Visualization</title>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    </head>
    <body>
        <div id="plot" style="width:100%;height:100vh;"></div>
        <script>
            const data = [{
                x: ${JSON.stringify(xData)},
                y: ${JSON.stringify(yData)},
                mode: 'markers+text',
                type: 'scatter',
                text: ${JSON.stringify(texts)},
                textposition: 'top center',
                marker: {
                    size: 12,
                    color: ${JSON.stringify(Array.from({ length: texts.length }, (_, i) => i))},
                    colorscale: 'Viridis',
                    showscale: true,
                    colorbar: { title: 'Index' }
                }
            }];

            const layout = {
                title: '2D Embedding Visualization (PCA)',
                xaxis: { title: 'PC1' },
                yaxis: { title: 'PC2' },
                hovermode: 'closest'
            };

            Plotly.newPlot('plot', data, layout);
        </script>
    </body>
    </html>
    `;

    // Save plot as HTML file
    const currentDir = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname));
    const outputPath = path.join(currentDir, filePathForPlot);
    fs.writeFileSync(outputPath, htmlContent);
}

async function main() {
    const texts = [
        "AI Engineering is the discipline focused on designing, building, and integrating AI solutions—combining software engineering, AI technologies, and an understanding of user and business needs.",
        "No prior experience is required—just a basic know-how of programming and strong interest in building intelligent systems and solving real-world problems.",
        "While some background in math is helpful (especially linear algebra, probability, and statistics), the course emphasizes practical engineering—building, integrating, and orchestrating AI systems.",
        "It blends traditional coding and system design with AI-specific tools, collaborative workflows, and rigorous verification of AI results. The focus is as much on orchestration and validation as on coding itself.",
        "Yes. You'll gain practical programming skills alongside hands-on experience with modern AI tools, models, and frameworks.",
    ];

    const embeddings = [];

    for (const text of texts) {
        const embedding = await createEmbedding(text);
        embeddings.push(embedding);
    }

    plotGraphUsingPCA(embeddings, texts, "embedding-3-plot.html");
}

main().catch((err) => {
    console.error("🔴 🔴 🔴 Error creating embedding -->", err);
});
