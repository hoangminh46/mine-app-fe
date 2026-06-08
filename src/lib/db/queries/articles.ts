import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import {
  renderMarkdown,
  calculateReadingTime,
  generateExcerpt,
} from "@/lib/markdown";
import type { Heading } from "@/lib/markdown";

export interface ArticleView {
  id: string;
  title: string;
  slug: string;
  content: string;
  htmlContent: string;
  headings: Heading[];
  status: string;
  difficulty: string;
  tags: string[];
  readingTime: number;
  excerpt: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  difficulty: string;
  tags: string[];
  readingTime: number;
  excerpt: string;
  folderId: string | null;
  folderSlug: string | null;
  folderName: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleView | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", user.id)
    .eq("slug", slug)
    .single();

  if (!data) return null;

  const { htmlContent, headings } = await renderMarkdown(data.content);

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    htmlContent,
    headings,
    status: data.status,
    difficulty: data.difficulty,
    tags: data.tags || [],
    readingTime: calculateReadingTime(data.content),
    excerpt: generateExcerpt(data.content),
    folderId: data.folder_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getArticlesByFolder(
  folderId: string
): Promise<ArticleListItem[]> {
  const user = await getUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, folders!articles_folder_id_fkey(slug, name)")
    .eq("user_id", user.id)
    .eq("folder_id", folderId)
    .order("order", { ascending: true })
    .order("title", { ascending: true });

  return (data || []).map(toArticleListItem);
}

export async function getAllUserArticles(): Promise<ArticleListItem[]> {
  const user = await getUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, folders!articles_folder_id_fkey(slug, name)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (data || []).map(toArticleListItem);
}

function toArticleListItem(row: Record<string, unknown>): ArticleListItem {
  const folder = row.folders as { slug: string; name: string } | null;
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    status: row.status as string,
    difficulty: row.difficulty as string,
    tags: (row.tags as string[]) || [],
    readingTime: calculateReadingTime((row.content as string) || ""),
    excerpt: generateExcerpt((row.content as string) || ""),
    folderId: row.folder_id as string | null,
    folderSlug: folder?.slug || null,
    folderName: folder?.name || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// Lightweight type for search index — no full content
export interface SearchableArticle {
  title: string;
  slug: string;
  status: string;
  difficulty: string;
  tags: string[];
  excerpt: string;
  folderSlug: string | null;
}

import { cache } from "react";

// React cache() deduplicates this call within a single server request tree
export const getSearchableArticles = cache(async (): Promise<SearchableArticle[]> => {
  const user = await getUser();
  if (!user) return [];

  const supabase = await createClient();

  // Only select fields needed for search — skip full content
  const { data } = await supabase
    .from("articles")
    .select("title, slug, status, difficulty, tags, content, folders!articles_folder_id_fkey(slug)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (data || []).map((row: Record<string, unknown>) => ({
    title: row.title as string,
    slug: row.slug as string,
    status: row.status as string,
    difficulty: row.difficulty as string,
    tags: (row.tags as string[]) || [],
    excerpt: generateExcerpt((row.content as string) || ""),
    folderSlug: (row.folders as { slug: string } | null)?.slug || null,
  }));
});

export interface DashboardFolder {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
  latestArticleTitle: string | null;
  latestUpdatedAt: string | null;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface DashboardData {
  folders: DashboardFolder[];
  popularTags: TagCount[];
}

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const user = await getUser();
  if (!user) return { folders: [], popularTags: [] };

  const supabase = await createClient();

  // Step 1: Fetch all folders
  const { data: folders } = await supabase
    .from("folders")
    .select("id, name, slug")
    .eq("user_id", user.id)
    .order("order", { ascending: true })
    .order("name", { ascending: true });

  // Step 2: Fetch all articles (lightweight — only folder_id, tags, updated_at, title)
  const { data: articles } = await supabase
    .from("articles")
    .select("folder_id, tags, updated_at, title")
    .eq("user_id", user.id);

  const articleList = articles || [];
  const folderList = folders || [];

  // Step 3: Build folder overview with article counts
  const folderMap = new Map<string, { count: number; latestTitle: string | null; latestDate: string | null }>();
  for (const f of folderList) {
    folderMap.set(f.id, { count: 0, latestTitle: null, latestDate: null });
  }

  for (const a of articleList) {
    if (a.folder_id && folderMap.has(a.folder_id)) {
      const entry = folderMap.get(a.folder_id)!;
      entry.count++;
      if (!entry.latestDate || a.updated_at > entry.latestDate) {
        entry.latestDate = a.updated_at;
        entry.latestTitle = a.title;
      }
    }
  }

  const dashboardFolders: DashboardFolder[] = folderList.map((f) => {
    const stats = folderMap.get(f.id)!;
    return {
      id: f.id,
      name: f.name,
      slug: f.slug,
      articleCount: stats.count,
      latestArticleTitle: stats.latestTitle,
      latestUpdatedAt: stats.latestDate,
    };
  });

  // Step 4: Aggregate popular tags
  const tagCounts = new Map<string, number>();
  for (const a of articleList) {
    const tags = (a.tags as string[]) || [];
    for (const tag of tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  const popularTags: TagCount[] = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return { folders: dashboardFolders, popularTags };
});

