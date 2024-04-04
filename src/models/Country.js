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
  },
  {
    paranoid: true,
  }
);

Country.hasMany(Destination, { foreignKey: "countryId" });
Destination.belongsTo(Country, { foreignKey: "countryId" });

module.exports = Country;
