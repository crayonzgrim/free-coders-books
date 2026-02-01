import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Users table (OAuth login)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  provider: text("provider").notNull(), // 'github'
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Bookmarks table (book_url references fpb.json book)
export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookUrl: text("book_url").notNull(), // fpb.json book URL (unique identifier)
  bookTitle: text("book_title").notNull(), // cached for display
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Likes table
export const likes = sqliteTable("likes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookUrl: text("book_url").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Like counts table (aggregated for performance)
export const likeCounts = sqliteTable("like_counts", {
  bookUrl: text("book_url").primaryKey(),
  count: integer("count").default(0),
});

// Visits table (daily visitor stats)
export const visits = sqliteTable("visits", {
  id: text("id").primaryKey(),
  date: text("date").notNull().unique(), // YYYY-MM-DD
  count: integer("count").default(1),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
export type LikeCount = typeof likeCounts.$inferSelect;
export type Visit = typeof visits.$inferSelect;
