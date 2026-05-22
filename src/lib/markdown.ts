import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeHighlight, { detect: true, ignoreMissing: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function renderMarkdown(content: string): Promise<string> {
  const result = await markdownProcessor.process(content);
  return String(result);
}

export function getHeadings(htmlContent: string): Heading[] {
  const headingRegex = /<h([234])\s+id="([^"]*)"[^>]*>(.*?)<\/h[234]>/gi;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10) as 2 | 3 | 4;
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, "").trim();
    headings.push({ id, text, level });
  }

  return headings;
}

const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string): number {
  const wordCount = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*\-_>|`]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function generateExcerpt(content: string, maxLength = 150): string {
  const stripped = content
    .replace(/---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*\-_>|`\[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength).replace(/\s\S*$/, "") + "...";
}
