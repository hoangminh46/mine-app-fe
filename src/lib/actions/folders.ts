"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createFolder(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  const parentId = (formData.get("parentId") as string) || null;

  if (!name) {
    return { error: "Tên folder không được để trống" };
  }

  if (name.length > 100) {
    return { error: "Tên folder tối đa 100 ký tự" };
  }

  const slug = generateSlug(name);
  if (!slug) {
    return { error: "Tên folder không hợp lệ" };
  }

  const supabase = await createClient();

  // Check duplicate slug within same parent
  let query = supabase
    .from("folders")
    .select("id")
    .eq("user_id", user.id)
    .eq("slug", slug);

  if (parentId) {
    query = query.eq("parent_id", parentId);
  } else {
    query = query.is("parent_id", null);
  }

  const { data: existing } = await query.single();

  if (existing) {
    return { error: "Folder với tên này đã tồn tại" };
  }

  const { error } = await supabase.from("folders").insert({
    user_id: user.id,
    name,
    slug,
    parent_id: parentId,
  });

  if (error) {
    return { error: "Không thể tạo folder. Vui lòng thử lại." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function renameFolder(folderId: string, newName: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const trimmedName = newName.trim();
  if (!trimmedName) {
    return { error: "Tên folder không được để trống" };
  }

  const newSlug = generateSlug(trimmedName);
  if (!newSlug) {
    return { error: "Tên folder không hợp lệ" };
  }

  const supabase = await createClient();

  // Get current folder to find parent
  const { data: current } = await supabase
    .from("folders")
    .select("parent_id")
    .eq("id", folderId)
    .eq("user_id", user.id)
    .single();

  if (!current) {
    return { error: "Folder không tồn tại" };
  }

  // Check duplicate slug within same parent (exclude self)
  let query = supabase
    .from("folders")
    .select("id")
    .eq("user_id", user.id)
    .eq("slug", newSlug)
    .neq("id", folderId);

  if (current.parent_id) {
    query = query.eq("parent_id", current.parent_id);
  } else {
    query = query.is("parent_id", null);
  }

  const { data: existing } = await query.single();

  if (existing) {
    return { error: "Folder với tên này đã tồn tại" };
  }

  const { error } = await supabase
    .from("folders")
    .update({ name: trimmedName, slug: newSlug })
    .eq("id", folderId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Không thể đổi tên folder. Vui lòng thử lại." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteFolder(folderId: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = await createClient();

  // Verify ownership
  const { data: folder } = await supabase
    .from("folders")
    .select("id")
    .eq("id", folderId)
    .eq("user_id", user.id)
    .single();

  if (!folder) {
    return { error: "Folder không tồn tại" };
  }

  // CASCADE delete handles child folders and articles (via ON DELETE CASCADE / SET NULL)
  const { error } = await supabase
    .from("folders")
    .delete()
    .eq("id", folderId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Không thể xóa folder. Vui lòng thử lại." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function getFolderArticleCount(folderId: string): Promise<number> {
  const user = await getUser();
  if (!user) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("folder_id", folderId)
    .eq("user_id", user.id);

  return count || 0;
}
