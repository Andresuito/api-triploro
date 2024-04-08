const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelizeConfig");

const PersonalItinerary = sequelize.define(
  "PersonalItinerary",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itineraryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = PersonalItinerary;
