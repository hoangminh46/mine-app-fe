import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

// ──────────────────────────────────────────────
// Profiles — extended user info (auto-created via trigger)
// ──────────────────────────────────────────────

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // references auth.users(id)
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ──────────────────────────────────────────────
// Folders — knowledge folders (per-user, supports nesting)
// ──────────────────────────────────────────────

export const folders = pgTable(
  "folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    parentId: uuid("parent_id"),
    order: integer("order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("folders_user_parent_slug").on(
      table.userId,
      table.parentId,
      table.slug
    ),
  ]
);

// ──────────────────────────────────────────────
// Articles — knowledge articles (per-user, belongs to folder)
// ──────────────────────────────────────────────

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    folderId: uuid("folder_id"),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    content: text("content").notNull().default(""),
    status: text("status").notNull().default("learning"),
    difficulty: text("difficulty").notNull().default("beginner"),
    tags: text("tags").array().default([]),
    order: integer("order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("articles_user_folder_slug").on(
      table.userId,
      table.folderId,
      table.slug
    ),
  ]
);
