-- Modify "email" table
ALTER TABLE [email] DROP CONSTRAINT [CK__email__subscript__22CA2527];
-- Modify "email" table
ALTER TABLE [email] ADD CONSTRAINT [CK__email__subscript__25A691D2] CHECK ([subscription]=N'premium' OR [subscription]=N'basic' OR [subscription]=N'free');
