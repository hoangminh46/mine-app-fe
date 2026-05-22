import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { profiles, folders, articles } from "./schema";

// ──────────────────────────────────────────────
// Select types (read from DB)
// ──────────────────────────────────────────────

export type Profile = InferSelectModel<typeof profiles>;
export type Folder = InferSelectModel<typeof folders>;
export type Article = InferSelectModel<typeof articles>;

// ──────────────────────────────────────────────
// Insert types (write to DB)
// ──────────────────────────────────────────────

export type NewProfile = InferInsertModel<typeof profiles>;
export type NewFolder = InferInsertModel<typeof folders>;
export type NewArticle = InferInsertModel<typeof articles>;

// ──────────────────────────────────────────────
// Enum-like types (matching CHECK constraints)
// ──────────────────────────────────────────────

export type ArticleStatus = "learning" | "reviewed" | "mastered";
export type ArticleDifficulty = "beginner" | "intermediate" | "advanced";
