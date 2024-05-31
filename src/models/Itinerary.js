const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelizeConfig");
const FavoriteItinerary = require("./FavoriteItinerary");
const PersonalItinerary = require("./PersonalItinerary");
const Tag = require("./Tag");

const Itinerary = sequelize.define(
  "Itinerary",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    season: {
      type: DataTypes.ENUM("Spring", "Summer", "Autumn", "Winter"),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);

Itinerary.belongsToMany(Tag, { through: "ItineraryTag" });
Tag.belongsToMany(Itinerary, { through: "ItineraryTag" });

Itinerary.hasMany(FavoriteItinerary, {
  foreignKey: "code",
  sourceKey: "code",
  as: "favoriteItineraries",
});
FavoriteItinerary.belongsTo(Itinerary, {
  foreignKey: "code",
  targetKey: "code",
  as: "itinerary",
});

Itinerary.hasMany(PersonalItinerary, {
  foreignKey: "itineraryId",
  as: "personalItineraries",
});
PersonalItinerary.belongsTo(Itinerary, { foreignKey: "itineraryId" });

module.exports = Itinerary;
