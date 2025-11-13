const cities = {
    // Destination: [Scenic, Cultural, Adventure, Accessibility, Affordability]
    Manali: [9, 5, 8, 5, 7],
    Goa: [8, 4, 7, 9, 5],
    // Jaipur: [6, 10, 4, 9, 6],
    Rishikesh: [7, 6, 10, 7, 9],
    "Leh-Ladakh": [10, 6, 9, 3, 4],
    Udaipur: [8, 8, 3, 8, 6],
    Varanasi: [5, 10, 2, 8, 8],
    Ooty: [9, 5, 3, 6, 7],
    "Andaman Islands": [10, 3, 6, 2, 3],
    Kolkata: [4, 9, 2, 10, 8],
    Delhi: [3, 10, 3, 10, 6],
    Mysuru: [7, 9, 3, 8, 7],
    Kodaikanal: [9, 5, 4, 5, 8],
    "Rann of Kutch": [8, 7, 5, 6, 7],
    Coorg: [9, 6, 6, 6, 6],
    Agra: [5, 10, 2, 9, 6],
};

const targetCity = [6, 10, 4, 9, 6];

for (let city in cities) {
    const x = cities[city][0];
    const y = cities[city][1];
    const result = x * targetCity[0] + y * targetCity[1];
    console.log(city, result);
}
