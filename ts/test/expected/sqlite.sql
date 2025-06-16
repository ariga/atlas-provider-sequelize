-- atlas:pos `public.email`[type=table] test/load-models.test.ts:21-27
-- atlas:pos user[type=table] test/load-models.test.ts:29-49
-- atlas:pos post[type=table] test/load-models.test.ts:51-70

CREATE TABLE IF NOT EXISTS `public.email` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
CREATE TABLE IF NOT EXISTS `user` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(50) NOT NULL, `role` TEXT DEFAULT 'user', `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
CREATE INDEX `user_name_idx` ON `user` (`name`);
CREATE TABLE IF NOT EXISTS `post` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(255) NOT NULL, `userId` INTEGER REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
