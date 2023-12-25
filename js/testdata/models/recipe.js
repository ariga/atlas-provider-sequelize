"use strict";
module.exports = function (sequelize, DataTypes) {
  const Recipe = sequelize.define(
    "Recipe",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      meal: {
        type: DataTypes.ENUM,
        values: ["breakfast", "lunch", "dinner", "dessert"],
        defaultValue: "lunch",
      },
    },
    {
      paranoid: true,
    },
  );

  Recipe.associate = (models) => {
    Recipe.belongsToMany(models.Ingredient, {
      through: "RecipeIngredient",
      foreignKey: "recipeId",
      as: "ingredients",
    });
    Recipe.hasMany(models.User, {
      foreignKey: "recipeId",
      as: "users",
    });
  };

  return Recipe;
};
