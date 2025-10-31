ALTER TABLE `entry_parts` RENAME COLUMN "partNumber" TO "totalParts";--> statement-breakpoint
DROP INDEX `unique_entry_part`;--> statement-breakpoint
ALTER TABLE `entry_parts` ADD `currentPart` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `entry_parts` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `entries` DROP COLUMN `userRating`;