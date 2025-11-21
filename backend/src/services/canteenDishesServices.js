import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createEmbedding } from "../ai/embeddingAssistant.js";
import { CanteenItem } from "../schemas/canteenItemSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Helper function to load dishes from JSON file
 * @returns {Array} Array of all dishes
 */
function loadDishes() {
    const dishesPath = path.join(__dirname, "./canteenDishes.json");
    const dishesData = fs.readFileSync(dishesPath, "utf-8");
    return JSON.parse(dishesData);
}

/**
 * Read and return all canteen dishes from the JSON file
 * @returns {Promise<Array>} Array of dish objects
 */
async function getAllDishes() {
    try {
        const dishes = loadDishes();
        // Return basic info: name, price, and spice level
        return dishes.map((d) => ({
            name: d.name,
            price: d.price,
            // spiceLevel: d.spiceLevel,
            // cuisine: d.cuisine,
        }));
    } catch (error) {
        console.error("Error reading dishes data:", error);
        throw new Error("Failed to fetch dishes");
    }
}

/**
 * Get dishes by cuisine type
 * @param {string} cuisine - The cuisine type
 * @returns {Promise<Array>} Array of dishes with basic info
 */
async function getDishesByCuisine(cuisine) {
    try {
        const dishes = loadDishes();
        const filtered = dishes.filter((d) => d.cuisine.toLowerCase() === cuisine.toLowerCase());
        // Return: name, price, vegetarian status, spice level
        return filtered.map((d) => ({
            name: d.name,
            price: d.price,
            isVegetarian: d.isVegetarian,
            spiceLevel: d.spiceLevel,
        }));
    } catch (error) {
        console.error("Error fetching dishes by cuisine:", error);
        throw error;
    }
}

/**
 * Get vegetarian dishes
 * @returns {Promise<Array>} Array of vegetarian dishes with basic info
 */
async function getVegetarianDishes() {
    try {
        const dishes = loadDishes();
        const filtered = dishes.filter((d) => d.isVegetarian === true);
        // Return: name, price, cuisine, spice level
        return filtered.map((d) => ({
            name: d.name,
            price: d.price,
            cuisine: d.cuisine,
            spiceLevel: d.spiceLevel,
        }));
    } catch (error) {
        console.error("Error fetching vegetarian dishes:", error);
        throw error;
    }
}

/**
 * Get non-vegetarian dishes
 * @returns {Promise<Array>} Array of non-vegetarian dishes with basic info
 */
async function getNonVegetarianDishes() {
    try {
        const dishes = loadDishes();
        const filtered = dishes.filter((d) => d.isVegetarian === false);
        // Return: name, price, cuisine, spice level
        return filtered.map((d) => ({
            name: d.name,
            price: d.price,
            cuisine: d.cuisine,
            spiceLevel: d.spiceLevel,
        }));
    } catch (error) {
        console.error("Error fetching non-vegetarian dishes:", error);
        throw error;
    }
}

/**
 * Get popular dishes
 * @returns {Promise<Array>} Array of popular dishes with basic info
 */
async function getPopularDishes() {
    try {
        const dishes = loadDishes();
        const filtered = dishes.filter((d) => d.popular === true);
        // Return: name, price, cuisine, spice level, description
        return filtered.map((d) => ({
            name: d.name,
            price: d.price,
            cuisine: d.cuisine,
            spiceLevel: d.spiceLevel,
            description: d.description,
        }));
    } catch (error) {
        console.error("Error fetching popular dishes:", error);
        throw error;
    }
}

/**
 * Bulk insert canteen items into the database with embeddings
 * @param {Array} items - Array of items to insert
 * @returns {Promise<Object>} Result of bulk insertion with success/failure counts
 */
async function bulkInsertCanteenItems(items) {
    const results = {
        successful: 0,
        failed: 0,
        errors: [],
        insertedIds: [],
    };

    for (let i = 0; i < items.length; i++) {
        try {
            const item = items[i];

            // Validate required fields
            if (
                !item.title ||
                !item.description ||
                !item.ingredients ||
                item.price === undefined ||
                item.preparation_time === undefined
            ) {
                results.failed++;
                results.errors.push({
                    index: i,
                    title: item.title || "Unknown",
                    error: "Missing required fields",
                });
                continue;
            }

            // Create embedding using all product info
            const textForEmbedding = `${item.title} \n ${item.description} \n Ingredients: ${item.ingredients} \n Price: ${item.price} \n Preparation time: ${item.preparation_time} minutes`;
            console.log("🟡 : textForEmbedding:", textForEmbedding);
            let embeddings = null;

            try {
                embeddings = await createEmbedding(textForEmbedding);
                console.log("🟡 : embeddings:", embeddings);
            } catch (embeddingError) {
                console.warn(`⚠️ Could not create embedding for "${item.title}", inserting without embeddings`);
            }

            // Insert into database
            const newItem = await CanteenItem.create({
                title: item.title,
                description: item.description,
                ingredients: item.ingredients,
                price: item.price,
                preparation_time: item.preparation_time,
                embeddings: embeddings,
            });
            console.log("🟡 : newItem:", newItem);

            results.successful++;
            results.insertedIds.push(newItem._id);
        } catch (error) {
            results.failed++;
            results.errors.push({
                index: i,
                title: items[i]?.title || "Unknown",
                error: error.message,
            });
            console.error(`🔴 Error inserting item at index ${i}:`, error.message);
        }
    }

    return results;
}

/**
 * Search for canteen items by query using vector search
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Array of matching canteen items
 */
async function searchCanteenItems(query) {
    try {
        if (!query || query.trim().length === 0) {
            throw new Error("Search query cannot be empty");
        }

        // Create embedding for the search query
        const queryEmbedding = await createEmbedding(query);

        // Use MongoDB vector search with cosine similarity
        const results = await CanteenItem.aggregate([
            {
                $vectorSearch: {
                    index: "ai-essentials-canteen-index-1",
                    path: "embeddings",
                    queryVector: queryEmbedding,
                    numCandidates: 200,
                    limit: 15,
                },
            },
            {
                $project: {
                    score: { $meta: "vectorSearchScore" },
                    title: 1,
                    description: 1,
                    price: 1,
                    preparation_time: 1,
                    ingredients: 1,
                },
            },
        ]);

        return results;
    } catch (error) {
        console.error("🔴 Error searching canteen items:", error);
        throw new Error(`Failed to search canteen items: ${error.message}`);
    }
}

export {
    bulkInsertCanteenItems,
    searchCanteenItems,
    getAllDishes,
    getDishesByCuisine,
    getVegetarianDishes,
    getNonVegetarianDishes,
    getPopularDishes,
};
