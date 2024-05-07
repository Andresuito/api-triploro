const Itinerary = require("../models/Itinerary");
const PersonalItinerary = require("../models/PersonalItinerary");

exports.createItinerary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code, city, days, startDate, endDate } = req.body;

    const userItineraries = await PersonalItinerary.count({
      where: { userId },
    });
    if (userItineraries >= 3) {
      return res.status(400).json({ error: "user_has_max_itineraries" });
    }

    const itinerary = await Itinerary.create({
      code,
      city,
      days,
      startDate,
      endDate,
    });

    await PersonalItinerary.create({ userId, itineraryId: itinerary.id });

    res.status(201).json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getAllUserItineraries = async (req, res) => {
  try {
    const userId = req.user.id;

    const personalItineraries = await PersonalItinerary.findAll({
      where: { userId },
    });
    if (!personalItineraries) {
      return res.status(404).json({ error: "itineraries_not_found" });
    }

    const itineraries = await Promise.all(
      personalItineraries.map(async (personalItinerary) => {
        return await Itinerary.findByPk(personalItinerary.itineraryId);
      })
    );

    res.json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
