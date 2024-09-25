-- Create "Ingredients" table
CREATE TABLE [Ingredients] (
  [id] int IDENTITY (1, 1) NOT NULL,
  [name] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [createdAt] datetimeoffset(7) NOT NULL,
  [updatedAt] datetimeoffset(7) NOT NULL,
  [deletedAt] datetimeoffset(7) NULL,
  CONSTRAINT [PK_Ingredients] PRIMARY KEY CLUSTERED ([id] ASC)
);
-- Create "RecipeIngredients" table
CREATE TABLE [RecipeIngredients] (
  [recipeId] int NOT NULL,
  [ingredientId] int NOT NULL,
  [meassurementAmount] int NOT NULL,
  [meassurementType] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [createdAt] datetimeoffset(7) NOT NULL,
  [updatedAt] datetimeoffset(7) NOT NULL,
  [deletedAt] datetimeoffset(7) NULL,
  CONSTRAINT [PK_RecipeIngredients] PRIMARY KEY CLUSTERED ([recipeId] ASC, [ingredientId] ASC)
);
-- Create index "recipe_ingredients_meassurement_type_meassurement_amount" to table: "RecipeIngredients"
CREATE UNIQUE NONCLUSTERED INDEX [recipe_ingredients_meassurement_type_meassurement_amount] ON [RecipeIngredients] ([meassurementType] ASC, [meassurementAmount] ASC);
-- Create "Recipes" table
CREATE TABLE [Recipes] (
  [id] int IDENTITY (1, 1) NOT NULL,
  [title] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [description] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [instructions] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [userId] int NOT NULL,
  [meal] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [createdAt] datetimeoffset(7) NOT NULL,
  [updatedAt] datetimeoffset(7) NOT NULL,
  [deletedAt] datetimeoffset(7) NULL,
  CONSTRAINT [PK_Recipes] PRIMARY KEY CLUSTERED ([id] ASC),
  CONSTRAINT [CK__Recipes__meal__24B26D99] CHECK ([meal]=N'dessert' OR [meal]=N'dinner' OR [meal]=N'lunch' OR [meal]=N'breakfast')
);
-- Create "Users" table
CREATE TABLE [Users] (
  [id] int IDENTITY (1, 1) NOT NULL,
  [name] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [recipeId] int NOT NULL,
  [createdAt] datetimeoffset(7) NOT NULL,
  [updatedAt] datetimeoffset(7) NOT NULL,
  [deletedAt] datetimeoffset(7) NULL,
  CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([id] ASC)
);
-- Modify "RecipeIngredients" table
ALTER TABLE [RecipeIngredients] ADD
 CONSTRAINT [FK__RecipeIng__ingre__2882FE7D] FOREIGN KEY ([ingredientId]) REFERENCES [Ingredients] ([id]) ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "RecipeIngredients" table
ALTER TABLE [RecipeIngredients] ADD
 CONSTRAINT [FK__RecipeIng__recip__278EDA44] FOREIGN KEY ([recipeId]) REFERENCES [Recipes] ([id]) ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "Recipes" table
ALTER TABLE [Recipes] ADD
 CONSTRAINT [FK__Recipes__userId__297722B6] FOREIGN KEY ([userId]) REFERENCES [Users] ([id]) ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "Users" table
ALTER TABLE [Users] ADD
 CONSTRAINT [FK__Users__recipeId__2A6B46EF] FOREIGN KEY ([recipeId]) REFERENCES [Recipes] ([id]) ON UPDATE NO ACTION ON DELETE NO ACTION;
