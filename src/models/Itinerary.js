const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelizeConfig");
const FavoriteItinerary = require("./FavoriteItinerary");
const PersonalItinerary = require("./PersonalItinerary");
const Tag = require("./Tag");

const Itinerary = sequelize.define(
  "Itinerary",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    season: {
      type: DataTypes.ENUM("Spring", "Summer", "Autumn", "Winter"),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    paranoid: true,
  }
);

Itinerary.belongsToMany(Tag, { through: "ItineraryTag" });
Tag.belongsToMany(Itinerary, { through: "ItineraryTag" });

Itinerary.hasMany(FavoriteItinerary, { foreignKey: "itineraryId" });
FavoriteItinerary.belongsTo(Itinerary, { foreignKey: "itineraryId" });
PersonalItinerary.belongsTo(Itinerary, { foreignKey: "itineraryId" });

module.exports = Itinerary;
