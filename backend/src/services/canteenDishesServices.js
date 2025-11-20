import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

export { getAllDishes, getDishesByCuisine, getVegetarianDishes, getNonVegetarianDishes, getPopularDishes };
