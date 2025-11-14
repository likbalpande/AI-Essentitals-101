const cities = {
    // pollution value, distance in south from Nagpur
    Delhi: [-600, -800],
    Ayodhya: [200, -1000],
    Noida: [-400, -700],
    Agra: [-400, -600],
    Nagpur: [0, 0],
    Mumbai: [-300, 900],
    // Pune: [-100, 700],
    Kolhapur: [200, 900],
    Banglore: [-100, 1200],
};

const targetCity = [-100, 700];

for (let city in cities) {
    const x = cities[city][0];
    const y = cities[city][1];
    const result = x * targetCity[0] + y * targetCity[1];
    console.log(city, result);
}
