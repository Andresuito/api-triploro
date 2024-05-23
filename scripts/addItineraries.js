const Itinerary = require("../src/models/Itinerary");
const Destination = require("../src/models/Destinations");

function generateCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

async function createFakeItineraries(numItineraries = 20) {
  const existingItineraries = await Itinerary.findAll();
  if (existingItineraries && existingItineraries.length > 0) {
    console.log("Itineraries already exist, no need to create more.");
    return;
  }

  const seasons = ["Spring", "Summer", "Autumn", "Winter"];
  const destinations = await Destination.findAll();

  for (let i = 0; i < numItineraries; i++) {
    const code = generateCode();
    const description = `Itinerary ${i}`;
    const city =
      destinations[i % destinations.length].name.charAt(0).toUpperCase() +
      destinations[i % destinations.length].name.slice(1);
    const days = Math.floor(Math.random() * 14) + 1;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);
    const imageUrl = ``;
    const season = seasons[i % seasons.length];
    const notes = `Notes for itinerary ${i}`;
    const public = Boolean(i % 2);

    const itinerary = {
      code,
      description,
      city,
      days,
      startDate,
      endDate,
      imageUrl,
      season,
      notes,
      public,
    };

    try {
      const existingItinerary = await Itinerary.findOne({ where: { code } });
      if (!existingItinerary) {
        await Itinerary.create(itinerary);
        console.log(`Created itinerary with code: ${code}`);
      } else {
        console.log(`Itinerary with code: ${code} already exists`);
      }
    } catch (error) {
      console.error(`Error creating itinerary: ${error}`);
    }
  }
}

module.exports = createFakeItineraries;
