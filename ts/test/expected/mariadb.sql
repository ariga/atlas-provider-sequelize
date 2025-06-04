CREATE TABLE IF NOT EXISTS `public`.`email` (`id` INTEGER auto_increment , `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS `user` (`id` INTEGER auto_increment , `name` VARCHAR(50) NOT NULL, `role` ENUM('admin', 'user', 'guest') DEFAULT 'user', `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
ALTER TABLE `user` ADD INDEX `user_name_idx` (`name`);
CREATE TABLE IF NOT EXISTS `post` (`id` INTEGER auto_increment , `title` VARCHAR(255) NOT NULL, `userId` INTEGER, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;
