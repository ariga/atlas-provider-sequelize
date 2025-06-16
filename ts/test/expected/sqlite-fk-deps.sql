-- atlas:pos author[type=table] test/models/Author.ts:13-32
-- atlas:pos book[type=table] test/models/Book.ts:13-32

CREATE TABLE IF NOT EXISTS `author` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(100) NOT NULL, `favoriteBookId` INTEGER REFERENCES `book` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
CREATE TABLE IF NOT EXISTS `book` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(200) NOT NULL, `authorId` INTEGER REFERENCES `author` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL); 