-- atlas:pos author[type=table] test/models/Author.ts:13-32
-- atlas:pos book[type=table] test/models/Book.ts:13-32

IF OBJECT_ID('[author]', 'U') IS NULL CREATE TABLE [author] ([id] INTEGER IDENTITY(1,1) , [name] NVARCHAR(100) NOT NULL, [favoriteBookId] INTEGER NULL, [createdAt] DATETIMEOFFSET NOT NULL, [updatedAt] DATETIMEOFFSET NOT NULL, PRIMARY KEY ([id]));
IF OBJECT_ID('[book]', 'U') IS NULL CREATE TABLE [book] ([id] INTEGER IDENTITY(1,1) , [title] NVARCHAR(200) NOT NULL, [authorId] INTEGER NULL, [createdAt] DATETIMEOFFSET NOT NULL, [updatedAt] DATETIMEOFFSET NOT NULL, PRIMARY KEY ([id]));
ALTER TABLE [author] ADD FOREIGN KEY ([favoriteBookId]) REFERENCES [book] ([id]) ON DELETE NO ACTION;
ALTER TABLE [book] ADD FOREIGN KEY ([authorId]) REFERENCES [author] ([id]) ON DELETE NO ACTION; 