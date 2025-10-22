import { sqliteTable, text, integer, real, index, unique } from "drizzle-orm/sqlite-core";

/**
 * Categories (dynamic: anime, drama, novels, comics, etc.)
 */
export const categories = sqliteTable("categories", {
  categoryId: text("categoryId").primaryKey(),
  name: text("name").notNull(),
  lastAccessed: integer("lastAccessed").notNull(),
  ord: integer("ord").default(0),
});

/**
 * Main entries table
 */
export const entries = sqliteTable("entries", {
  entryId: text("entryId").primaryKey(),
  categoryId: text("categoryId").notNull().references(() => categories.categoryId, { onDelete: 'cascade' }),
  
  // Basic Info
  title: text("title").notNull(),
  coverImageUrl: text("coverImageUrl"),
  //blur background image URL
  coverImageBlurUrl: text("coverImageBlurUrl"),
  description: text("description"),
  genres: text("genres", { mode: 'json' }).$type<string[]>(), // JSON array
  releaseYear: integer("releaseYear"),
  releaseStatus: text("releaseStatus", { enum: ['ongoing', 'completed', 'hiatus', 'cancelled'] }),
  
  // Overall Status
  status: text("status", { enum: ['current', 'planned', 'completed', 'dropped', 'hold'] }).notNull(),
  
  // User Ratings & Notes
  tier: text("tier", { enum: ['S', 'A', 'B', 'C', 'D', 'E'] }),
  isFavorite: integer("isFavorite", { mode: 'boolean' }).default(false),
  notes: text("notes"),
  
  // Dates
  completedDate: text("completedDate"), // Store as ISO string
  
  // Timestamps
  createdAt: integer("createdAt").notNull(), // Store as Unix timestamp
  updatedAt: integer("updatedAt").notNull(),
}, (table) => ({
  // Indexes for performance
  statusIdx: index("idx_entries_status").on(table.status),
  categoryIdx: index("idx_entries_category").on(table.categoryId),
  favoriteIdx: index("idx_entries_favorite").on(table.isFavorite),
}));

/**
 * Season/Volume/Arc tracking (optional, for detailed progress)
 */
export const entryParts = sqliteTable("entry_parts", {
  partId: text("partId").primaryKey(),
  entryId: text("entryId").notNull().references(() => entries.entryId, { onDelete: 'cascade' }),
  currentPart: integer("currentPart", { mode: 'number' }).default(0),
  totalParts: integer("totalParts").notNull(), // Season 1, Volume 2
  partType: text("partType", { enum: ['season', 'volume', 'arc', 'part'] }).notNull(),
  
  // Progress within this part
  currentProgress: integer("currentProgress").default(0),
  totalProgress: integer("totalProgress"),
  progressUnit: text("progressUnit", { enum: ['episodes', 'chapters', 'pages'] }),
  
  // Status for this specific part
  status: text("status", { enum: ['current', 'completed', 'dropped', 'hold', 'planned'] }).notNull().default('planned'),
  completedDate: text("completedDate"),
  
  // Timestamps
  createdAt: integer("createdAt").notNull(),
  updatedAt: integer("updatedAt").notNull(),
}, (table) => ({
  // Indexes and Unique Constraints
  entryIdx: index("idx_entry_parts_entry").on(table.entryId),
}));