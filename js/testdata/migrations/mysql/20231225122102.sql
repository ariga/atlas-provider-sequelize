-- Create "Ingredients" table
CREATE TABLE `Ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL,
  PRIMARY KEY (`id`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "RecipeIngredients" table
CREATE TABLE `RecipeIngredients` (
  `recipeId` int NOT NULL,
  `ingredientId` int NOT NULL,
  `meassurementAmount` int NOT NULL,
  `meassurementType` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL,
  PRIMARY KEY (`recipeId`, `ingredientId`),
  INDEX `ingredientId` (`ingredientId`),
  UNIQUE INDEX `recipe_ingredients_meassurement_type_meassurement_amount` (`meassurementType`, `meassurementAmount`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "Recipes" table
CREATE TABLE `Recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `instructions` text NOT NULL,
  `userId` int NOT NULL,
  `meal` enum('breakfast','lunch','dinner','dessert') NULL DEFAULT "lunch",
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL,
  PRIMARY KEY (`id`),
  INDEX `userId` (`userId`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "Users" table
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `recipeId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL,
  PRIMARY KEY (`id`),
  INDEX `recipeId` (`recipeId`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Modify "RecipeIngredients" table
ALTER TABLE `RecipeIngredients` ADD CONSTRAINT `RecipeIngredients_ibfk_1` FOREIGN KEY (`recipeId`) REFERENCES `Recipes` (`id`) ON UPDATE CASCADE ON DELETE CASCADE, ADD CONSTRAINT `RecipeIngredients_ibfk_2` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredients` (`id`) ON UPDATE CASCADE ON DELETE CASCADE;
-- Modify "Recipes" table
ALTER TABLE `Recipes` ADD CONSTRAINT `Recipes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE;
-- Modify "Users" table
ALTER TABLE `Users` ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`recipeId`) REFERENCES `Recipes` (`id`) ON UPDATE CASCADE ON DELETE CASCADE;
