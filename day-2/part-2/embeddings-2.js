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
        "Car",
        "Tiger",
        "Cricket",
        "Fish",
        "City",
        "Delhi",
        "Pune",
        "Air",
        "Mobile",
        "Chocolate",
        "Tree",
        "Laptop",
        "Goa",
        "Parrot",
        "Honey",
    ];

    const embeddings = [];

    for (const text of texts) {
        const embedding = await createEmbedding(text);
        embeddings.push(embedding);
    }

    plotGraphUsingPCA(embeddings, texts, "embedding-2-plot.html");
}

main().catch((err) => {
    console.error("🔴 🔴 🔴 Error creating embedding -->", err);
});
