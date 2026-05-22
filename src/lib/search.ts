import { getAllArticles } from "./knowledge";

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
  const articles = await getAllArticles();

  return articles.map((article) => {
    // Extract category from slug (first part)
    const category = article.slug.split("/")[0] || "";

    return {
      slug: article.slug,
      title: article.frontmatter.title,
      tags: article.frontmatter.tags,
      excerpt: article.excerpt,
      category: category
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      status: article.frontmatter.status,
      difficulty: article.frontmatter.difficulty,
    };
  });
}
