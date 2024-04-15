const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../../config/sequelizeConfig");
const FavoriteItinerary = require("./FavoriteItinerary");
const PersonalItinerary = require("./PersonalItinerary");

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiveNewsletter: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    receiveNewDestination: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeSave: async (user, options) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.hasMany(FavoriteItinerary, { foreignKey: "userId" });
User.hasMany(PersonalItinerary, { foreignKey: "userId" });

module.exports = User;
