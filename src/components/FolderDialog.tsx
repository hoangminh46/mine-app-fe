"use client";

import { useState, useRef } from "react";
import { createFolder, renameFolder } from "@/lib/actions/folders";
import { useRouter } from "next/navigation";

interface FolderDialogProps {
  mode: "create" | "rename";
  isOpen: boolean;
  onClose: () => void;
  parentId?: string | null;
  folderId?: string;
  currentName?: string;
}

export default function FolderDialog({
  mode,
  isOpen,
  onClose,
  parentId,
  folderId,
  currentName,
}: FolderDialogProps) {
  const [name, setName] = useState(currentName || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "create") {
        const formData = new FormData();
        formData.set("name", name);
        if (parentId) formData.set("parentId", parentId);
        const result = await createFolder(formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
      } else if (mode === "rename" && folderId) {
        const result = await renameFolder(folderId, name);
        if (result?.error) {
          setError(result.error);
          return;
        }
      }

      router.refresh();
      onClose();
    } catch {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">
          {mode === "create" ? "📂 Tạo folder mới" : "✏️ Đổi tên folder"}
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên folder..."
            className="dialog-input"
            maxLength={100}
            disabled={loading}
          />

          {error && <p className="dialog-error">{error}</p>}

          <div className="dialog-actions">
            <button
              type="button"
              onClick={onClose}
              className="dialog-btn dialog-btn-cancel"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="dialog-btn dialog-btn-primary"
              disabled={loading || !name.trim()}
            >
              {loading ? "..." : mode === "create" ? "Tạo" : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
