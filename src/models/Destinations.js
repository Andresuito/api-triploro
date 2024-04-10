const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelizeConfig");
const Tag = require("./Tag");

const Destination = sequelize.define(
  "Destination",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
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

Destination.belongsToMany(Tag, { through: "DestinationTag" });
Tag.belongsToMany(Destination, { through: "DestinationTag" });

module.exports = Destination;
