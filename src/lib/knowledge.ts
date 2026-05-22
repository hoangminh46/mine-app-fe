import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

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

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

export interface KnowledgeNode {
  slug: string;
  title: string;
  type: "folder" | "article";
  order: number;
  children?: KnowledgeNode[];
  // Article-specific fields (only when type === 'article')
  tags?: string[];
  status?: ArticleStatus;
  difficulty?: ArticleDifficulty;
  created?: string;
  updated?: string;
}

export interface ArticleData {
  frontmatter: ArticleFrontmatter;
  htmlContent: string;
  headings: Heading[];
  slug: string;
  readingTime: number;
  excerpt: string;
}

export interface ArticleListItem {
  frontmatter: ArticleFrontmatter;
  slug: string;
  readingTime: number;
  excerpt: string;
}

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const KNOWLEDGE_DIR = path.join(process.cwd(), "docs", "knowledge");
const WORDS_PER_MINUTE = 200;

// ──────────────────────────────────────────────
// Markdown Processing Pipeline
// ──────────────────────────────────────────────

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeHighlight, { detect: true, ignoreMissing: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

async function renderMarkdown(content: string): Promise<string> {
  const result = await markdownProcessor.process(content);
  return String(result);
}

// ──────────────────────────────────────────────
// Frontmatter Parsing (with fallback defaults)
// ──────────────────────────────────────────────

function parseFrontmatter(
  rawData: matter.GrayMatterFile<string>,
  filename: string
): ArticleFrontmatter {
  const data = rawData.data;

  const titleFromFilename = filename
    .replace(/\.md$/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: (data.title as string) || titleFromFilename,
    tags: Array.isArray(data.tags) ? data.tags : [],
    order: typeof data.order === "number" ? data.order : 999,
    status: isValidStatus(data.status) ? data.status : "learning",
    difficulty: isValidDifficulty(data.difficulty)
      ? data.difficulty
      : "beginner",
    created: data.created ? String(data.created) : "",
    updated: data.updated
      ? String(data.updated)
      : data.created
        ? String(data.created)
        : "",
  };
}

function isValidStatus(value: unknown): value is ArticleStatus {
  return (
    typeof value === "string" &&
    ["learning", "reviewed", "mastered"].includes(value)
  );
}

function isValidDifficulty(value: unknown): value is ArticleDifficulty {
  return (
    typeof value === "string" &&
    ["beginner", "intermediate", "advanced"].includes(value)
  );
}

// ──────────────────────────────────────────────
// Heading Extraction
// ──────────────────────────────────────────────

export function getHeadings(htmlContent: string): Heading[] {
  const headingRegex = /<h([234])\s+id="([^"]*)"[^>]*>(.*?)<\/h[234]>/gi;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10) as 2 | 3 | 4;
    const id = match[2];
    // Strip inner HTML tags from heading text
    const text = match[3].replace(/<[^>]*>/g, "").trim();

    headings.push({ id, text, level });
  }

  return headings;
}

// ──────────────────────────────────────────────
// Reading Time & Excerpt
// ──────────────────────────────────────────────

function calculateReadingTime(content: string): number {
  const wordCount = content
    .replace(/```[\s\S]*?```/g, "") // strip code blocks
    .replace(/[#*\-_>|`]/g, "") // strip markdown symbols
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function generateExcerpt(content: string, maxLength = 150): string {
  const stripped = content
    .replace(/---[\s\S]*?---/, "") // strip frontmatter
    .replace(/```[\s\S]*?```/g, "") // strip code blocks
    .replace(/[#*\-_>|`\[\]()]/g, "") // strip markdown symbols
    .replace(/\n+/g, " ") // normalize newlines
    .trim();

  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength).replace(/\s\S*$/, "") + "...";
}

// ──────────────────────────────────────────────
// Core API: getKnowledgeTree()
// ──────────────────────────────────────────────

export function getKnowledgeTree(): KnowledgeNode[] {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return [];
  return scanDirectory(KNOWLEDGE_DIR, "");
}

function scanDirectory(dirPath: string, parentSlug: string): KnowledgeNode[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const nodes: KnowledgeNode[] = [];

  for (const entry of entries) {
    // Skip hidden files/folders
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;

    const currentSlug = parentSlug
      ? `${parentSlug}/${entry.name}`
      : entry.name;

    if (entry.isDirectory()) {
      const children = scanDirectory(
        path.join(dirPath, entry.name),
        currentSlug
      );

      const folderTitle = entry.name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      nodes.push({
        slug: currentSlug,
        title: folderTitle,
        type: "folder",
        order: 0,
        children,
      });
    } else if (entry.name.endsWith(".md")) {
      const filePath = path.join(dirPath, entry.name);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const parsed = matter(fileContent);
      const frontmatter = parseFrontmatter(parsed, entry.name);
      const articleSlug = currentSlug.replace(/\.md$/, "");

      nodes.push({
        slug: articleSlug,
        title: frontmatter.title,
        type: "article",
        order: frontmatter.order,
        tags: frontmatter.tags,
        status: frontmatter.status,
        difficulty: frontmatter.difficulty,
        created: frontmatter.created,
        updated: frontmatter.updated,
      });
    }
  }

  // Sort: folders first, then by order, then alphabetically
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

// ──────────────────────────────────────────────
// Core API: getArticle()
// ──────────────────────────────────────────────

export async function getArticle(
  slugParts: string[]
): Promise<ArticleData | null> {
  const relativePath = slugParts.join(path.sep) + ".md";
  const filePath = path.join(KNOWLEDGE_DIR, relativePath);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(fileContent);
  const filename = slugParts[slugParts.length - 1] + ".md";
  const frontmatter = parseFrontmatter(parsed, filename);
  const htmlContent = await renderMarkdown(parsed.content);
  const headings = getHeadings(htmlContent);
  const readingTime = calculateReadingTime(parsed.content);
  const excerpt = generateExcerpt(parsed.content);

  return {
    frontmatter,
    htmlContent,
    headings,
    slug: slugParts.join("/"),
    readingTime,
    excerpt,
  };
}

// ──────────────────────────────────────────────
// Core API: getAllArticles()
// ──────────────────────────────────────────────

export async function getAllArticles(): Promise<ArticleData[]> {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return [];

  const articles: ArticleData[] = [];
  await collectArticles(KNOWLEDGE_DIR, [], articles);

  // Sort by updated date (newest first), then by order
  return articles.sort((a, b) => {
    if (a.frontmatter.updated && b.frontmatter.updated) {
      return b.frontmatter.updated.localeCompare(a.frontmatter.updated);
    }
    return a.frontmatter.order - b.frontmatter.order;
  });
}

async function collectArticles(
  dirPath: string,
  parentParts: string[],
  articles: ArticleData[]
): Promise<void> {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;

    if (entry.isDirectory()) {
      await collectArticles(
        path.join(dirPath, entry.name),
        [...parentParts, entry.name],
        articles
      );
    } else if (entry.name.endsWith(".md")) {
      const slugParts = [...parentParts, entry.name.replace(/\.md$/, "")];
      const article = await getArticle(slugParts);
      if (article) articles.push(article);
    }
  }
}

// ──────────────────────────────────────────────
// Core API: getArticlesByFolder()
// ──────────────────────────────────────────────

export async function getArticlesByFolder(
  folderSlug: string
): Promise<ArticleListItem[]> {
  const allArticles = await getAllArticles();
  return allArticles
    .filter((a) => a.slug.startsWith(folderSlug + "/"))
    .map(({ frontmatter, slug, readingTime, excerpt }) => ({
      frontmatter,
      slug,
      readingTime,
      excerpt,
    }));
}

// ──────────────────────────────────────────────
// Core API: isFolder()
// ──────────────────────────────────────────────

export function isFolder(slugParts: string[]): boolean {
  const dirPath = path.join(KNOWLEDGE_DIR, ...slugParts);
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}
