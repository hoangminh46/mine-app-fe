"use client";

import { useState } from "react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error handled by caller
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">⚠️ {title}</h3>
        <p className="dialog-message">{message}</p>

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
            type="button"
            onClick={handleConfirm}
            className="dialog-btn dialog-btn-danger"
            disabled={loading}
          >
            {loading ? "..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
