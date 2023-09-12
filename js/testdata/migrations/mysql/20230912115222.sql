-- Create "Recipes" table
CREATE TABLE `Recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `instructions` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL,
  PRIMARY KEY (`id`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
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
  CONSTRAINT `RecipeIngredients_ibfk_1` FOREIGN KEY (`recipeId`) REFERENCES `Recipes` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `RecipeIngredients_ibfk_2` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredients` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
