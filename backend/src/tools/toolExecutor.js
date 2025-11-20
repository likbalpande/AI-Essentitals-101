// import { getUserDetails, updateUserDetails } from "../services/userProfileService.js";
import {
    getAllDishes,
    getVegetarianDishes,
    getNonVegetarianDishes,
    getDishesByCuisine,
    getPopularDishes,
} from "../services/canteenDishesServices.js";

/**
 * Execute a tool call with the given parameters
 * @param {string} toolName - Name of the tool to execute
 * @param {Object} parameters - Parameters for the tool
 * @returns {Promise<string>} - Result of the tool execution
 */
async function executeTool(toolName, parameters) {
    try {
        switch (toolName) {
            case "get_all_dishes": {
                const dishes = await getAllDishes();

                return JSON.stringify({
                    success: true,
                    data: dishes,
                });
            }

            case "get_vegetarian_dishes": {
                const dishes = await getVegetarianDishes();

                return JSON.stringify({
                    success: true,
                    data: dishes,
                });
            }

            case "get_non_vegetarian_dishes": {
                const dishes = await getNonVegetarianDishes();

                return JSON.stringify({
                    success: true,
                    data: dishes,
                });
            }

            case "get_dishes_by_cuisine": {
                const { cuisine } = parameters;
                if (!cuisine) {
                    return JSON.stringify({ error: "cuisine is required" });
                }

                const dishes = await getDishesByCuisine(cuisine);

                return JSON.stringify({
                    success: true,
                    data: dishes,
                });
            }

            case "get_popular_dishes": {
                const dishes = await getPopularDishes();

                return JSON.stringify({
                    success: true,
                    data: dishes,
                });
            }

            // case "get_user_profile": {
            //     const { userId } = parameters;
            //     if (!userId) {
            //         return JSON.stringify({ error: "userId is required" });
            //     }

            //     const userProfile = await getUserDetails(userId);

            //     if (!userProfile) {
            //         return JSON.stringify({
            //             error: "User profile not found",
            //         });
            //     }

            //     return JSON.stringify({
            //         success: true,
            //         data: userProfile,
            //     });
            // }

            // case "update_user_profile": {
            //     const { userId, ...updateData } = parameters;
            //     if (!userId) {
            //         return JSON.stringify({ error: "userId is required" });
            //     }

            //     const updatedProfile = await updateUserDetails(userId, updateData);

            //     return JSON.stringify({
            //         success: true,
            //         message: "Profile updated successfully",
            //         data: updatedProfile,
            //     });
            // }

            default:
                return JSON.stringify({
                    error: `Unknown tool: ${toolName}`,
                });
        }
    } catch (error) {
        console.error(`Error executing tool ${toolName}:`, error);
        return JSON.stringify({
            error: error.message || "Tool execution failed",
        });
    }
}

export { executeTool };
