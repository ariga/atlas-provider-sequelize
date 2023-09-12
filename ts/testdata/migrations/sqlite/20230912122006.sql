-- Create "contact" table
CREATE TABLE `contact` (
  `id` integer NULL PRIMARY KEY AUTOINCREMENT,
  `name` varchar NOT NULL,
  `alias` varchar NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
);
-- Create "email" table
CREATE TABLE `email` (
  `id` integer NULL PRIMARY KEY AUTOINCREMENT,
  `email` varchar NOT NULL,
  `contact_id` integer NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  CONSTRAINT `0` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Create "phone" table
CREATE TABLE `phone` (
  `id` integer NULL PRIMARY KEY AUTOINCREMENT,
  `phone` varchar NOT NULL,
  `contact_id` integer NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  CONSTRAINT `0` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
