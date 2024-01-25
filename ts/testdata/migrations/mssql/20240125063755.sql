-- Create "contact" table
CREATE TABLE [contact] (
  [id] int IDENTITY (1, 1) NOT NULL,
  [name] nvarchar(45) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [alias] nvarchar(45) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [created_at] datetimeoffset(7) NOT NULL,
  [updated_at] datetimeoffset(7) NOT NULL,
  CONSTRAINT [PK_contact] PRIMARY KEY CLUSTERED ([id] ASC)
);
-- Create index "name-alias" to table: "contact"
CREATE UNIQUE NONCLUSTERED INDEX [name-alias] ON [contact] ([name] ASC, [alias] ASC);
-- Create "email" table
CREATE TABLE [email] (
  [id] int IDENTITY (1, 1) NOT NULL,
  [email] nvarchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [subscription] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [contact_id] int NOT NULL,
  [created_at] datetimeoffset(7) NOT NULL,
  [updated_at] datetimeoffset(7) NOT NULL,
  CONSTRAINT [PK_email] PRIMARY KEY CLUSTERED ([id] ASC),
 
  CONSTRAINT [FK__email__contact_i__23BE4960] FOREIGN KEY ([contact_id]) REFERENCES [contact] ([id]) ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT [CK__email__subscript__22CA2527] CHECK ([subscription]=N'premium' OR [subscription]=N'basic' OR [subscription]=N'free')
);
-- Create "phone" table
CREATE TABLE [phone] (
  [id] int IDENTITY (1, 1) NOT NULL,
  [phone] nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [contact_id] int NOT NULL,
  [created_at] datetimeoffset(7) NOT NULL,
  [updated_at] datetimeoffset(7) NOT NULL,
  CONSTRAINT [PK_phone] PRIMARY KEY CLUSTERED ([id] ASC),
 
  CONSTRAINT [FK__phone__contact_i__269AB60B] FOREIGN KEY ([contact_id]) REFERENCES [contact] ([id]) ON UPDATE NO ACTION ON DELETE CASCADE
);
