-- Create enum type "enum_Recipes_meal"
CREATE TYPE "public"."enum_Recipes_meal" AS ENUM ('breakfast', 'lunch', 'dinner', 'dessert');
-- Create "Ingredients" table
CREATE TABLE "public"."Ingredients" (
  "id" serial NOT NULL,
  "name" character varying(255) NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL,
  "deletedAt" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create "RecipeIngredients" table
CREATE TABLE "public"."RecipeIngredients" (
  "recipeId" integer NOT NULL,
  "ingredientId" integer NOT NULL,
  "meassurementAmount" integer NOT NULL,
  "meassurementType" character varying(255) NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL,
  "deletedAt" timestamptz NULL,
  PRIMARY KEY ("recipeId", "ingredientId")
);
-- Create index "recipe_ingredients_meassurement_type_meassurement_amount" to table: "RecipeIngredients"
CREATE UNIQUE INDEX "recipe_ingredients_meassurement_type_meassurement_amount" ON "public"."RecipeIngredients" ("meassurementType", "meassurementAmount");
-- Create "Recipes" table
CREATE TABLE "public"."Recipes" (
  "id" serial NOT NULL,
  "title" character varying(255) NOT NULL,
  "description" text NOT NULL,
  "instructions" text NOT NULL,
  "userId" integer NOT NULL,
  "meal" "public"."enum_Recipes_meal" NULL DEFAULT 'lunch',
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL,
  "deletedAt" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create "Users" table
CREATE TABLE "public"."Users" (
  "id" serial NOT NULL,
  "name" character varying(255) NOT NULL,
  "recipeId" integer NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL,
  "deletedAt" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Modify "RecipeIngredients" table
ALTER TABLE "public"."RecipeIngredients" ADD
 CONSTRAINT "RecipeIngredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."Ingredients" ("id") ON UPDATE CASCADE ON DELETE CASCADE, ADD
 CONSTRAINT "RecipeIngredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."Recipes" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
-- Modify "Recipes" table
ALTER TABLE "public"."Recipes" ADD
 CONSTRAINT "Recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
-- Modify "Users" table
ALTER TABLE "public"."Users" ADD
 CONSTRAINT "Users_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."Recipes" ("id") ON UPDATE CASCADE ON DELETE NO ACTION;
