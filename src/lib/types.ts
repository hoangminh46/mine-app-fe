// Shared UI types for components that display article/folder data
// These types decouple UI components from both the old filesystem layer and the new DB layer

export type ArticleStatus = "learning" | "reviewed" | "mastered";
export type ArticleDifficulty = "beginner" | "intermediate" | "advanced";

export interface ArticleFrontmatter {
  title: string;
  tags: string[];
  order: number;
  status: ArticleStatus;
  difficulty: ArticleDifficulty;
  created: string;
  updated: string;
}

export interface ArticleListItem {
  frontmatter: ArticleFrontmatter;
  slug: string;
  readingTime: number;
  excerpt: string;
}
