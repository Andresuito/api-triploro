const Itinerary = require("../models/Itinerary");
const PersonalItinerary = require("../models/PersonalItinerary");

exports.createItinerary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    const existingItinerary = await Itinerary.findOne({ where: { name } });
    if (existingItinerary) {
      return res.status(400).json({ error: "name_taken" });
    }

    const userItineraries = await PersonalItinerary.count({
      where: { userId },
    });
    if (userItineraries >= 3) {
      return res.status(400).json({ error: "user_has_max_itineraries" });
    }

    const itinerary = await Itinerary.create({ name });

    await PersonalItinerary.create({ userId, itineraryId: itinerary.id });

    res.status(201).json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
