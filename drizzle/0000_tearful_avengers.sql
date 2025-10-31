CREATE TABLE `categories` (
	`categoryId` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`lastAccessed` integer NOT NULL,
	`ord` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `entries` (
	`entryId` text PRIMARY KEY NOT NULL,
	`categoryId` text NOT NULL,
	`title` text NOT NULL,
	`coverImageUrl` text,
	`description` text,
	`genres` text,
	`releaseYear` integer,
	`releaseStatus` text,
	`status` text NOT NULL,
	`userRating` real,
	`tier` text,
	`isFavorite` integer DEFAULT false,
	`notes` text,
	`completedDate` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`categoryId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_entries_status` ON `entries` (`status`);--> statement-breakpoint
CREATE INDEX `idx_entries_category` ON `entries` (`categoryId`);--> statement-breakpoint
CREATE INDEX `idx_entries_favorite` ON `entries` (`isFavorite`);--> statement-breakpoint
CREATE TABLE `entry_parts` (
	`partId` text PRIMARY KEY NOT NULL,
	`entryId` text NOT NULL,
	`partNumber` integer NOT NULL,
	`partType` text NOT NULL,
	`title` text,
	`currentProgress` integer DEFAULT 0,
	`totalProgress` integer,
	`progressUnit` text,
	`status` text DEFAULT 'planned' NOT NULL,
	`completedDate` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`entryId`) REFERENCES `entries`(`entryId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_entry_parts_entry` ON `entry_parts` (`entryId`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_entry_part` ON `entry_parts` (`entryId`,`partNumber`,`partType`);