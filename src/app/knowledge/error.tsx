"use client";

export default function KnowledgeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <div className="error-icon">📚</div>
      <h2 className="error-title">Không thể tải nội dung</h2>
      <p className="error-message">
        Không thể tải bài viết hoặc thư mục. Vui lòng kiểm tra kết nối mạng và thử lại.
      </p>
      <button className="error-retry-btn" onClick={reset}>
        🔄 Thử lại
      </button>
    </div>
  );
}
