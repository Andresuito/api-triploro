const Country = require("../models/Country");

exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getCountryByName = async (req, res) => {
  try {
    const country = await Country.findOne({ where: { name: req.params.name } });
    if (!country) {
      return res.status(404).json({ error: "country_not_found" });
    }
    res.json(country);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
