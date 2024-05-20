const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelizeConfig");

const FavoriteItinerary = sequelize.define(
  "FavoriteItinerary",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    paranoid: false,
  }
);

module.exports = FavoriteItinerary;
