"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <div className="error-icon">⚠️</div>
      <h2 className="error-title">Không thể tải trang chủ</h2>
      <p className="error-message">
        Đã có lỗi xảy ra khi tải dữ liệu. Có thể do kết nối mạng hoặc hệ thống đang bảo trì.
      </p>
      <button className="error-retry-btn" onClick={reset}>
        🔄 Thử lại
      </button>
    </div>
  );
}
