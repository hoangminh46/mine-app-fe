"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createArticle, updateArticle } from "@/lib/actions/articles";
import type { SidebarFolder } from "@/lib/db/queries/folders";

// Lazy load markdown editor (heavy component, avoid SSR)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface ArticleEditorProps {
  mode: "create" | "edit";
  articleId?: string;
  initialData?: {
    title: string;
    content: string;
    folderId: string | null;
    status: string;
    difficulty: string;
    tags: string[];
  };
  folders: SidebarFolder[];
}

export default function ArticleEditor({
  mode,
  articleId,
  initialData,
  folders,
}: ArticleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [folderId, setFolderId] = useState(initialData?.folderId || "");
  const [status, setStatus] = useState(initialData?.status || "learning");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "beginner");
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function flattenFolders(
    folderList: SidebarFolder[],
    depth = 0
  ): Array<{ id: string; name: string; depth: number }> {
    const result: Array<{ id: string; name: string; depth: number }> = [];
    for (const f of folderList) {
      result.push({ id: f.id, name: f.name, depth });
      result.push(...flattenFolders(f.children, depth + 1));
    }
    return result;
  }

  const flatFolders = flattenFolders(folders);

  async function handleSave() {
    setError("");
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const input = {
      title,
      content,
      folderId: folderId || null,
      status,
      difficulty,
      tags,
    };

    try {
      const result =
        mode === "create"
          ? await createArticle(input)
          : await updateArticle(articleId!, input);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.redirectPath) {
        router.push(result.redirectPath);
        router.refresh();
      }
    } catch {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="editor-page">
      {/* Header */}
      <div className="editor-header">
        <button
          className="editor-back-btn"
          onClick={() => router.back()}
        >
          ← Quay lại
        </button>
        <h1 className="editor-page-title">
          {mode === "create" ? "📝 Bài viết mới" : "✏️ Chỉnh sửa"}
        </h1>
        <button
          className="editor-save-btn"
          onClick={handleSave}
          disabled={saving || !title.trim()}
        >
          {saving ? "Đang lưu..." : "💾 Lưu"}
        </button>
      </div>

      {error && <p className="editor-error">{error}</p>}

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề bài viết..."
        className="editor-title-input"
        autoFocus
      />

      {/* Metadata row */}
      <div className="editor-meta-row">
        <select
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="editor-select"
        >
          <option value="">📁 Không có folder</option>
          {flatFolders.map((f) => (
            <option key={f.id} value={f.id}>
              {"  ".repeat(f.depth)}📂 {f.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="editor-select"
        >
          <option value="learning">📖 Learning</option>
          <option value="reviewed">🔍 Reviewed</option>
          <option value="mastered">✅ Mastered</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="editor-select"
        >
          <option value="beginner">🟢 Beginner</option>
          <option value="intermediate">🟡 Intermediate</option>
          <option value="advanced">🔴 Advanced</option>
        </select>

        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Tags (phân cách bằng dấu phẩy)"
          className="editor-tags-input"
        />
      </div>

      {/* Markdown Editor */}
      <div className="editor-container" data-color-mode="dark">
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || "")}
          height={600}
          preview="live"
          visibleDragbar={false}
        />
      </div>
    </div>
  );
}
