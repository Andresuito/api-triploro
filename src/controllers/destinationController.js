const Destinations = require("../models/Destinations");
const Countries = require("../models/Country");

exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destinations.findAll();
    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getDestinationsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const country = await Countries.findOne({ where: { name } });

    if (!country) {
      return res.status(404).json({ error: "country_not_found" });
    }

    const destinations = await Destinations.findAll({
      where: { countryId: country.id },
    });

    if (!destinations) {
      return res.status(404).json({ error: "destinations_not_found" });
    }

    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
