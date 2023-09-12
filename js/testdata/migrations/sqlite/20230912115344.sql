-- Create "Ingredients" table
CREATE TABLE `Ingredients` (
  `id` integer NULL PRIMARY KEY AUTOINCREMENT,
  `name` varchar NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL
);
-- Create "Recipes" table
CREATE TABLE `Recipes` (
  `id` integer NULL PRIMARY KEY AUTOINCREMENT,
  `title` varchar NOT NULL,
  `description` text NOT NULL,
  `instructions` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL
);
-- Create "RecipeIngredients" table
CREATE TABLE `RecipeIngredients` (
  `recipeId` integer NOT NULL,
  `ingredientId` integer NOT NULL,
  `meassurementAmount` integer NOT NULL,
  `meassurementType` varchar NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL,
  PRIMARY KEY (`recipeId`, `ingredientId`),
  CONSTRAINT `0` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredients` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `1` FOREIGN KEY (`recipeId`) REFERENCES `Recipes` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
