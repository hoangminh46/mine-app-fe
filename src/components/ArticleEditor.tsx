"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createArticle, updateArticle } from "@/lib/actions/articles";
import { saveDraft, loadDraft, clearDraft } from "@/lib/utils/draft";
import type { DraftData } from "@/lib/utils/draft";
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
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<DraftData | null>(null);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUserEdited = useRef(false);

  // Step 1: Check for existing draft on mount
  useEffect(() => {
    const draft = loadDraft(articleId);
    if (!draft) return;

    // Draft exists — check if it's newer than initial data
    const hasChanges =
      draft.title !== (initialData?.title || "") ||
      draft.content !== (initialData?.content || "");

    if (hasChanges) {
      setPendingDraft(draft);
      setShowDraftRecovery(true);
    } else {
      clearDraft(articleId);
    }
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 2: Auto-save draft every 5s after user edits
  const scheduleDraftSave = useCallback(() => {
    if (!hasUserEdited.current) return;

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      setDraftStatus("saving");

      const draftData: DraftData = {
        title,
        content,
        folderId,
        status,
        difficulty,
        tagsInput,
        savedAt: Date.now(),
      };

      const saved = saveDraft(draftData, articleId);

      if (saved) {
        setDraftStatus("saved");
        setTimeout(() => setDraftStatus("idle"), 2000);
      } else {
        setDraftStatus("idle");
      }
    }, 5000);
  }, [title, content, folderId, status, difficulty, tagsInput, articleId]);

  useEffect(() => {
    scheduleDraftSave();
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [scheduleDraftSave]);

  // Mark that user has started editing
  function handleFieldChange<T>(setter: (val: T) => void) {
    return (val: T) => {
      hasUserEdited.current = true;
      setter(val);
    };
  }

  // Draft recovery handlers
  function handleRestoreDraft() {
    if (!pendingDraft) return;
    setTitle(pendingDraft.title);
    setContent(pendingDraft.content);
    setFolderId(pendingDraft.folderId);
    setStatus(pendingDraft.status);
    setDifficulty(pendingDraft.difficulty);
    setTagsInput(pendingDraft.tagsInput);
    setShowDraftRecovery(false);
    setPendingDraft(null);
  }

  function handleDiscardDraft() {
    clearDraft(articleId);
    setShowDraftRecovery(false);
    setPendingDraft(null);
  }

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

      // Clear draft after successful save
      clearDraft(articleId);

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
      {/* Draft recovery banner */}
      {showDraftRecovery && pendingDraft && (
        <div className="draft-recovery-banner">
          <span>📝 Phát hiện bản nháp chưa lưu từ {new Date(pendingDraft.savedAt).toLocaleString("vi-VN")}</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="draft-restore-btn" onClick={handleRestoreDraft}>
              Khôi phục
            </button>
            <button className="draft-discard-btn" onClick={handleDiscardDraft}>
              Bỏ qua
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="editor-header">
        <button
          className="editor-back-btn"
          onClick={() => router.back()}
        >
          ← Quay lại
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <h1 className="editor-page-title">
            {mode === "create" ? "📝 Bài viết mới" : "✏️ Chỉnh sửa"}
          </h1>
          {/* Draft saved indicator */}
          {draftStatus !== "idle" && (
            <span className="draft-status-indicator">
              {draftStatus === "saving" ? "💾 Đang lưu nháp..." : "✅ Đã lưu nháp"}
            </span>
          )}
        </div>
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
        onChange={(e) => handleFieldChange(setTitle)(e.target.value)}
        placeholder="Tiêu đề bài viết..."
        className="editor-title-input"
        autoFocus
      />

      {/* Metadata row */}
      <div className="editor-meta-row">
        <select
          value={folderId}
          onChange={(e) => handleFieldChange(setFolderId)(e.target.value)}
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
          onChange={(e) => handleFieldChange(setStatus)(e.target.value)}
          className="editor-select"
        >
          <option value="learning">📖 Learning</option>
          <option value="reviewed">🔍 Reviewed</option>
          <option value="mastered">✅ Mastered</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => handleFieldChange(setDifficulty)(e.target.value)}
          className="editor-select"
        >
          <option value="beginner">🟢 Beginner</option>
          <option value="intermediate">🟡 Intermediate</option>
          <option value="advanced">🔴 Advanced</option>
        </select>

        <input
          type="text"
          value={tagsInput}
          onChange={(e) => handleFieldChange(setTagsInput)(e.target.value)}
          placeholder="Tags (phân cách bằng dấu phẩy)"
          className="editor-tags-input"
        />
      </div>

      {/* Markdown Editor */}
      <div className="editor-container" data-color-mode="dark">
        <MDEditor
          value={content}
          onChange={(val) => handleFieldChange(setContent)(val || "")}
          height={600}
          preview="live"
          visibleDragbar={false}
        />
      </div>
    </div>
  );
}
