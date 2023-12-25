"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Recipe, {
      foreignKey: "userId",
      as: "recipes",
    });
  };

  return User;
};
