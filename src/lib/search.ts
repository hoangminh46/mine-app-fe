import { getAllUserArticles } from "@/lib/db/queries/articles";

export interface SearchItem {
  slug: string;
  title: string;
  tags: string[];
  excerpt: string;
  category: string;
  status: string;
  difficulty: string;
}

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const articles = await getAllUserArticles();

  return articles.map((article) => ({
    slug: article.folderSlug
      ? `${article.folderSlug}/${article.slug}`
      : article.slug,
    title: article.title,
    tags: article.tags,
    excerpt: article.excerpt,
    category: article.folderSlug
      ? article.folderSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "",
    status: article.status,
    difficulty: article.difficulty,
  }));
}
