const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelizeConfig");

const FavoriteItinerary = sequelize.define(
  "FavoriteItinerary",
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

module.exports = FavoriteItinerary;
