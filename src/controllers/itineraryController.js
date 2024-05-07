const Itinerary = require("../models/Itinerary");
const PersonalItinerary = require("../models/PersonalItinerary");

exports.createItinerary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code, city, days, startDate, endDate } = req.body;

    console.log(req.body);

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
