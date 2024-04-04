const Country = require("../src/models/Country");

async function addCountries() {
  try {
    await Country.findOrCreate({ where: { name: "Spain" } });
    await Country.findOrCreate({ where: { name: "Portugal" } });
  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

module.exports = addCountries;
