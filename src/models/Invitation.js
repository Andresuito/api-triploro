const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelizeConfig");

const Invitation = sequelize.define(
  "Invitation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invitedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Invitation;
