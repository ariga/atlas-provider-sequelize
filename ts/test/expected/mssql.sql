-- atlas:pos [public].[email][type=table] test/load-models.test.ts:21-27
-- atlas:pos user[type=table] test/load-models.test.ts:29-49
-- atlas:pos post[type=table] test/load-models.test.ts:51-70

IF OBJECT_ID('[public].[email]', 'U') IS NULL CREATE TABLE [public].[email] ([id] INTEGER IDENTITY(1,1) , [createdAt] DATETIMEOFFSET NOT NULL, [updatedAt] DATETIMEOFFSET NOT NULL, PRIMARY KEY ([id]));
IF OBJECT_ID('[user]', 'U') IS NULL CREATE TABLE [user] ([id] INTEGER IDENTITY(1,1) , [name] NVARCHAR(50) NOT NULL, [role] VARCHAR(255) CHECK ([role] IN(N'admin', N'user', N'guest')), [createdAt] DATETIMEOFFSET NOT NULL, [updatedAt] DATETIMEOFFSET NOT NULL, PRIMARY KEY ([id]));
CREATE INDEX [user_name_idx] ON [user] ([name]);
IF OBJECT_ID('[post]', 'U') IS NULL CREATE TABLE [post] ([id] INTEGER IDENTITY(1,1) , [title] NVARCHAR(255) NOT NULL, [userId] INTEGER NULL, [createdAt] DATETIMEOFFSET NOT NULL, [updatedAt] DATETIMEOFFSET NOT NULL, PRIMARY KEY ([id]), FOREIGN KEY ([userId]) REFERENCES [user] ([id]) ON DELETE NO ACTION);
