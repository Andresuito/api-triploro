const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelizeConfig");

const Destination = require("./Destinations");

const Country = sequelize.define(
  "Country",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    capital: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    continent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    paranoid: true,
  }
);

Country.hasMany(Destination, { foreignKey: "countryId" });
Destination.belongsTo(Country, { foreignKey: "countryId" });

module.exports = Country;
