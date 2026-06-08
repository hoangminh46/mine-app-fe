"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils/slug";

interface ArticleInput {
  title: string;
  content: string;
  folderId: string;
  status: string;
  difficulty: string;
  tags: string[];
}

// Defense-in-depth: strip dangerous HTML from raw markdown before DB storage
function sanitizeMarkdownContent(content: string): string {
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "")
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "");
}

export async function createArticle(input: ArticleInput) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  if (!input.title.trim()) {
    return { error: "Tiêu đề không được để trống" };
  }

  if (!input.folderId) {
    return { error: "Bài viết bắt buộc phải nằm trong một folder" };
  }

  const slug = generateSlug(input.title);
  if (!slug) {
    return { error: "Tiêu đề không hợp lệ" };
  }

  const supabase = await createClient();

  // Check duplicate slug for this user
  const { data: existing } = await supabase
    .from("articles")
    .select("id")
    .eq("user_id", user.id)
    .eq("slug", slug)
    .single();

  if (existing) {
    return { error: "Bài viết với tiêu đề tương tự đã tồn tại" };
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({
      user_id: user.id,
      title: input.title.trim(),
      slug,
      content: sanitizeMarkdownContent(input.content),
      folder_id: input.folderId,
      status: input.status || "learning",
      difficulty: input.difficulty || "beginner",
      tags: input.tags,
    })
    .select("slug, folder_id")
    .single();

  if (error) {
    return { error: "Không thể tạo bài viết. Vui lòng thử lại." };
  }

  revalidatePath("/", "layout");

  let folderSlug: string | null = null;
  if (data.folder_id) {
    const { data: folder } = await supabase
      .from("folders")
      .select("slug")
      .eq("id", data.folder_id)
      .single();
    folderSlug = folder?.slug || null;
  }

  const redirectPath = folderSlug
    ? `/knowledge/${folderSlug}/${data.slug}`
    : `/knowledge/${data.slug}`;

  return { success: true, redirectPath };
}

export async function updateArticle(articleId: string, input: ArticleInput) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  if (!input.title.trim()) {
    return { error: "Tiêu đề không được để trống" };
  }

  if (!input.folderId) {
    return { error: "Bài viết bắt buộc phải nằm trong một folder" };
  }

  const slug = generateSlug(input.title);
  if (!slug) {
    return { error: "Tiêu đề không hợp lệ" };
  }

  const supabase = await createClient();

  // Check duplicate slug (exclude self)
  const { data: existing } = await supabase
    .from("articles")
    .select("id")
    .eq("user_id", user.id)
    .eq("slug", slug)
    .neq("id", articleId)
    .single();

  if (existing) {
    return { error: "Bài viết với tiêu đề tương tự đã tồn tại" };
  }

  const { data, error } = await supabase
    .from("articles")
    .update({
      title: input.title.trim(),
      slug,
      content: sanitizeMarkdownContent(input.content),
      folder_id: input.folderId,
      status: input.status,
      difficulty: input.difficulty,
      tags: input.tags,
    })
    .eq("id", articleId)
    .eq("user_id", user.id)
    .select("slug, folder_id")
    .single();

  if (error) {
    return { error: "Không thể cập nhật bài viết. Vui lòng thử lại." };
  }

  revalidatePath("/", "layout");

  let folderSlug: string | null = null;
  if (data.folder_id) {
    const { data: folder } = await supabase
      .from("folders")
      .select("slug")
      .eq("id", data.folder_id)
      .single();
    folderSlug = folder?.slug || null;
  }

  const redirectPath = folderSlug
    ? `/knowledge/${folderSlug}/${data.slug}`
    : `/knowledge/${data.slug}`;

  return { success: true, redirectPath };
}

export async function deleteArticle(articleId: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = await createClient();

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", articleId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Không thể xóa bài viết. Vui lòng thử lại." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function getArticleForEdit(articleSlug: string) {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("id, title, content, folder_id, status, difficulty, tags")
    .eq("user_id", user.id)
    .eq("slug", articleSlug)
    .single();

  return data;
}
