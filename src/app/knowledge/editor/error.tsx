"use client";

export default function EditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <div className="error-icon">✏️</div>
      <h2 className="error-title">Không thể tải trình soạn thảo</h2>
      <p className="error-message">
        Đã có lỗi khi tải editor. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <button className="error-retry-btn" onClick={reset}>
        🔄 Thử lại
      </button>
    </div>
  );
}
