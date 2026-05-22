import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

export interface SidebarFolder {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
  children: SidebarFolder[];
  articles: SidebarArticle[];
}

export interface SidebarArticle {
  id: string;
  title: string;
  slug: string;
  status: string;
  order: number;
  folderId: string | null;
}

export async function getFolderTree(): Promise<SidebarFolder[]> {
  const user = await getUser();
  if (!user) return [];

  const supabase = await createClient();

  const { data: folders } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", user.id)
    .order("order", { ascending: true })
    .order("name", { ascending: true });

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, status, folder_id, order")
    .eq("user_id", user.id)
    .order("order", { ascending: true })
    .order("title", { ascending: true });

  return buildTree(folders || [], articles || []);
}

function buildTree(
  folders: Array<{
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    order: number;
  }>,
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    folder_id: string | null;
    order: number;
  }>
): SidebarFolder[] {
  const folderMap = new Map<string, SidebarFolder>();

  // Step 1: Create SidebarFolder objects
  for (const f of folders) {
    folderMap.set(f.id, {
      id: f.id,
      name: f.name,
      slug: f.slug,
      parentId: f.parent_id,
      order: f.order,
      children: [],
      articles: [],
    });
  }

  // Step 2: Attach articles to folders
  for (const a of articles) {
    const article: SidebarArticle = {
      id: a.id,
      title: a.title,
      slug: a.slug,
      status: a.status,
      order: a.order,
      folderId: a.folder_id,
    };

    if (a.folder_id && folderMap.has(a.folder_id)) {
      folderMap.get(a.folder_id)!.articles.push(article);
    }
  }

  // Step 3: Build folder hierarchy
  const roots: SidebarFolder[] = [];
  for (const folder of folderMap.values()) {
    if (folder.parentId && folderMap.has(folder.parentId)) {
      folderMap.get(folder.parentId)!.children.push(folder);
    } else {
      roots.push(folder);
    }
  }

  return roots;
}

export async function getFolderBySlug(
  slug: string
): Promise<{ id: string; name: string; slug: string } | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("folders")
    .select("id, name, slug")
    .eq("user_id", user.id)
    .eq("slug", slug)
    .single();

  return data;
}

// Get root-level articles (no folder)
export async function getRootArticles(): Promise<SidebarArticle[]> {
  const user = await getUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, status, folder_id, order")
    .eq("user_id", user.id)
    .is("folder_id", null)
    .order("order", { ascending: true })
    .order("title", { ascending: true });

  return (data || []).map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    status: a.status,
    order: a.order,
    folderId: a.folder_id,
  }));
}
