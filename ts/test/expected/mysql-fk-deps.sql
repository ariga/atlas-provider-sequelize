-- atlas:pos author[type=table] test/models/Author.ts:13-32
-- atlas:pos book[type=table] test/models/Book.ts:13-32

CREATE TABLE IF NOT EXISTS `author` (`id` INTEGER auto_increment , `name` VARCHAR(100) NOT NULL, `favoriteBookId` INTEGER, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS `book` (`id` INTEGER auto_increment , `title` VARCHAR(200) NOT NULL, `authorId` INTEGER, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
ALTER TABLE `author` ADD FOREIGN KEY (`favoriteBookId`) REFERENCES `book` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE `book` ADD FOREIGN KEY (`authorId`) REFERENCES `author` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE; 