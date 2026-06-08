"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteArticle } from "@/lib/actions/articles";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useToast } from "./Toast";

interface ArticleActionsProps {
  articleId: string;
  articleSlug: string;
}

export default function ArticleActions({ articleId, articleSlug }: ArticleActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDelete, setShowDelete] = useState(false);

  async function handleDelete() {
    const result = await deleteArticle(articleId);
    if (result?.error) {
      toast(result.error, "error");
      return;
    }
    toast("Đã xóa bài viết", "success");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="article-actions">
      <Link
        href={`/knowledge/editor/${articleSlug}`}
        className="article-action-btn"
        title="Chỉnh sửa"
      >
        ✏️
      </Link>
      <button
        className="article-action-btn article-action-danger"
        onClick={() => setShowDelete(true)}
        title="Xóa"
      >
        🗑️
      </button>

      {showDelete && (
        <DeleteConfirmDialog
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
          title="Xóa bài viết"
          message="Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác."
        />
      )}
    </div>
  );
}
