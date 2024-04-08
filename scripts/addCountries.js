const Country = require("../src/models/Country");

async function addCountries() {
  try {
    await Country.findOrCreate({
      where: { name: "spain" },
      defaults: {
        description: "spainDescription",
        image: "es",
        capital: "madrid",
        continent: "europe",
      },
    });
    await Country.findOrCreate({
      where: { name: "portugal" },
      defaults: {
        description: "portugalDescription",
        image: "pt",
        capital: "lisbon",
        continent: "europe",
      },
    });
  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

module.exports = addCountries;
