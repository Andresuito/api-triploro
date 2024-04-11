const Destination = require("../src/models/Destinations");
const Tag = require("../src/models/Tag");

async function addTagsToDestinations() {
  try {
    const destinationTags = {
      madrid: ["sightseeing", "art", "shopping", "nightlife", "gastronomy"],
      barcelona: [
        "sightseeing",
        "beach",
        "architecture",
        "nightlife",
        "gastronomy",
      ],
      valencia: ["sightseeing", "beach", "science", "gastronomy", "parks"],
      seville: ["sightseeing", "flamenco", "history", "gastronomy", "markets"],
      malaga: ["beach", "sunbathing", "foodie", "nightlife", "shopping"],
      bilbao: ["museums", "art", "architecture", "gastronomy", "parks"],
      granada: [
        "sightseeing",
        "history",
        "architecture",
        "gastronomy",
        "mountains",
      ],
      zaragoza: ["sightseeing", "history", "foodie", "gastronomy", "parks"],
      "palma de mallorca": [
        "beach",
        "sightseeing",
        "nature",
        "nightlife",
        "gastronomy",
      ],
      lisbon: ["sightseeing", "history", "foodie", "nightlife", "markets"],
      oporto: ["wine", "sightseeing", "architecture", "gastronomy", "markets"],
      faro: ["beach", "sightseeing", "nature", "gastronomy", "markets"],
      coimbra: ["university", "history", "architecture", "gastronomy", "parks"],
      braga: ["religion", "history", "architecture", "gastronomy", "markets"],
      aveiro: ["sightseeing", "nature", "architecture", "gastronomy", "canals"],
      evora: [
        "history",
        "sightseeing",
        "architecture",
        "gastronomy",
        "markets",
      ],
      guimaraes: ["history", "architecture", "culture", "gastronomy", "parks"],
    };

    for (const destinationName in destinationTags) {
      const destination = await Destination.findOne({
        where: { name: destinationName },
      });

      if (destination) {
        const specificTags = destinationTags[destinationName];

        for (const tagName of specificTags) {
          let tag = await Tag.findOne({ where: { name: tagName } });

          if (!tag) {
            tag = await Tag.create({ name: tagName });
          }

          const hasTag = await destination.hasTag(tag);

          if (!hasTag) {
            await destination.addTag(tag);
          }
        }
      } else {
        console.error(`Destination '${destinationName}' was not found.`);
      }
    }

    console.log("Specific tags added to destinations successfully.");
  } catch (error) {
    console.error("Error when adding specific tags to destinations:", error);
  }
}

module.exports = addTagsToDestinations;
