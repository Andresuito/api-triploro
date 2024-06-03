const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelizeConfig");
const Itinerary = require("./Itinerary");

const Activity = sequelize.define(
  "Activity",
  {
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);

Activity.belongsTo(Itinerary, { foreignKey: "itineraryId" });
Itinerary.hasMany(Activity, { foreignKey: "itineraryId" });

module.exports = Activity;
