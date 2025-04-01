-- Modify "Recipes" table
ALTER TABLE [Recipes] DROP CONSTRAINT [CK__Recipes__meal__24B26D99];
-- Modify "Recipes" table
ALTER TABLE [Recipes] ADD CONSTRAINT [CK__Recipes__meal__22CA2527] CHECK ([meal]=N'dessert' OR [meal]=N'dinner' OR [meal]=N'lunch' OR [meal]=N'breakfast');
