import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Root, Element } from "hast";
import type { VFile } from "vfile";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

export interface MarkdownResult {
  htmlContent: string;
  headings: Heading[];
}

// Whitelist highlight.js classes + heading ids so sanitize doesn't strip them
const sanitizeSchema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span || []), ["className", /^hljs-/]],
    code: [
      ...(defaultSchema.attributes?.code || []),
      ["className", /^hljs|^language-/],
    ],
    h1: [...(defaultSchema.attributes?.h1 || []), "id"],
    h2: [...(defaultSchema.attributes?.h2 || []), "id"],
    h3: [...(defaultSchema.attributes?.h3 || []), "id"],
    h4: [...(defaultSchema.attributes?.h4 || []), "id"],
  },
};

function extractHeadings() {
  return (tree: Root, file: VFile) => {
    const headings: Heading[] = [];
    visit(tree, "element", (node: Element) => {
      const tag = node.tagName;
      if (tag === "h2" || tag === "h3" || tag === "h4") {
        headings.push({
          id: (node.properties?.id as string) || "",
          text: toString(node),
          level: parseInt(tag[1], 10) as 2 | 3 | 4,
        });
      }
    });
    file.data.headings = headings;
  };
}

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeHighlight, { ignoreMissing: true } as Parameters<typeof rehypeHighlight>[0])
  .use(extractHeadings)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeStringify);

export async function renderMarkdown(content: string): Promise<MarkdownResult> {
  const result = await markdownProcessor.process(content);
  return {
    htmlContent: String(result),
    headings: (result.data.headings as Heading[]) || [],
  };
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
