const TagModel = require("../src/models/Tag");

async function addTags() {
  const tags = [
    "sunbathing",
    "surfing",
    "snorkeling",
    "sightseeing",
    "museums",
    "art",
    "spa",
    "yoga",
    "meditation",
    "foodie",
    "wine",
    "craftbeer",
    "historical",
    "architecture",
    "shopping",
    "music",
    "festivals",
    "parks",
    "gardens",
    "theatre",
    "nature",
    "beach",
    "science",
    "flamenco",
    "history",
    "university",
    "religion",
    "history",
    "culture",
  ];

  try {
    for (const name of tags) {
      await TagModel.findOrCreate({ where: { name } });
    }
  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

module.exports = addTags;
