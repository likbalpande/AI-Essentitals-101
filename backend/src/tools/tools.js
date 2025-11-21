/**
 * Tool definitions for the AI assistant
 * These define what functions the AI can call
 */

const tools = [
    // {
    //     type: "function",
    //     function: {
    //         name: "get_all_dishes",
    //         description: "Get a list of all available dishes in the canteen with their details including name, price",
    //         parameters: {
    //             type: "object",
    //             properties: {},
    //             required: [],
    //             additionalProperties: false,
    //         },
    //     },
    // },
    // {
    //     type: "function",
    //     function: {
    //         name: "get_vegetarian_dishes",
    //         description: "Get a list of all vegetarian dishes available in the canteen.",
    //         parameters: {
    //             type: "object",
    //             properties: {},
    //             required: [],
    //             additionalProperties: false,
    //         },
    //     },
    // },
    // {
    //     type: "function",
    //     function: {
    //         name: "get_non_vegetarian_dishes",
    //         description: "Get a list of all non-vegetarian (meat) dishes available in the canteen.",
    //         parameters: {
    //             type: "object",
    //             properties: {},
    //             required: [],
    //             additionalProperties: false,
    //         },
    //     },
    // },
    // {
    //     type: "function",
    //     function: {
    //         name: "get_dishes_by_cuisine",
    //         description:
    //             "Get dishes filtered by cuisine type ('North Indian', 'South Indian', 'Mughlai', 'Hyderabadi', 'Maharashtrian').",
    //         parameters: {
    //             type: "object",
    //             properties: {
    //                 cuisine: {
    //                     type: "string",
    //                     description:
    //                         "The cuisine type to filter by 'North Indian', 'South Indian', 'Mughlai', 'Hyderabadi', 'Maharashtrian'",
    //                 },
    //             },
    //             required: ["cuisine"],
    //             additionalProperties: false,
    //         },
    //     },
    // },
    // {
    //     type: "function",
    //     function: {
    //         name: "get_popular_dishes",
    //         description: "Get a list of the most popular dishes in the canteen.",
    //         parameters: {
    //             type: "object",
    //             properties: {},
    //             required: [],
    //             additionalProperties: false,
    //         },
    //     },
    // },
    {
        type: "function",
        function: {
            name: "search_canteen_items",
            description:
                "Search for canteen items using semantic vector search based on keywords, descriptions, or any dish characteristics.",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description:
                            "Search query to find canteen items based on its information. try to plan the query in a way to just get the items and then figure out how to articulate them in you answer.",
                    },
                },
                required: ["query"],
                additionalProperties: false,
            },
        },
    },
];

export { tools };

// {
//     type: "function",
//     function: {
//         name: "get_user_profile",
//         description:
//             "Get detailed user profile information including dietary preferences, spice level, and other personal settings.",
//         parameters: {
//             type: "object",
//             properties: {
//                 userId: {
//                     type: "string",
//                     description: "The unique identifier of the user",
//                 },
//             },
//             required: ["userId"],
//             additionalProperties: false,
//         },
//     },
// },
// {
//     type: "function",
//     function: {
//         name: "update_user_profile",
//         description:
//             "Update user profile information such as name, phone, dietary preferences, spice level, or cuisines.",
//         parameters: {
//             type: "object",
//             properties: {
//                 userId: {
//                     type: "string",
//                     description: "The unique identifier of the user",
//                 },
//                 firstName: {
//                     type: "string",
//                     description: "User's first name",
//                 },
//                 lastName: {
//                     type: "string",
//                     description: "User's last name",
//                 },
//                 phone: {
//                     type: "string",
//                     description: "User's phone number",
//                 },
//                 isVegetarian: {
//                     type: "boolean",
//                     description: "Whether the user is vegetarian",
//                 },
//                 spicyLevel: {
//                     type: "string",
//                     enum: ["mild", "medium", "very_spicy"],
//                     description: "Preferred spice level for food",
//                 },
//             },
//             required: ["userId"],
//             additionalProperties: false,
//         },
//     },
// },
