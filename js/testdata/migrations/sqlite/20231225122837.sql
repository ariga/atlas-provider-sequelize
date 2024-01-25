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
  `userId` integer NOT NULL,
  `meal` text NULL DEFAULT 'lunch',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL,
  CONSTRAINT `0` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
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
-- Create index "recipe_ingredients_meassurement_type_meassurement_amount" to table: "RecipeIngredients"
CREATE UNIQUE INDEX `recipe_ingredients_meassurement_type_meassurement_amount` ON `RecipeIngredients` (`meassurementType`, `meassurementAmount`);
-- Create "Users" table
CREATE TABLE `Users` (
  `id` integer NULL PRIMARY KEY AUTOINCREMENT,
  `name` varchar NOT NULL,
  `recipeId` integer NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL,
  CONSTRAINT `0` FOREIGN KEY (`recipeId`) REFERENCES `Recipes` (`id`) ON UPDATE CASCADE ON DELETE NO ACTION
);
