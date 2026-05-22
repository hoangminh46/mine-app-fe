import Link from "next/link";
import { getAllUserArticles } from "@/lib/db/queries/articles";

export default async function DashboardPage() {
  const articles = await getAllUserArticles();

  // Stats
  const total = articles.length;
  const learningCount = articles.filter((a) => a.status === "learning").length;
  const reviewedCount = articles.filter((a) => a.status === "reviewed").length;
  const masteredCount = articles.filter((a) => a.status === "mastered").length;

  // Recent articles (already sorted by updated_at DESC from query)
  const recentArticles = articles.slice(0, 5);

  const stats = [
    { label: "Total Articles", count: total, emoji: "📚", className: "stat-total" },
    { label: "Learning", count: learningCount, emoji: "📖", className: "stat-learning" },
    { label: "Reviewed", count: reviewedCount, emoji: "🔍", className: "stat-reviewed" },
    { label: "Mastered", count: masteredCount, emoji: "✅", className: "stat-mastered" },
  ];

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <h1 className="dashboard-title gradient-text">
          Mine Knowledge Base
        </h1>
        <p className="dashboard-subtitle">
          Lưu trữ, tổ chức và học tập kiến thức hiệu quả
        </p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Nhấn{" "}
          <kbd className="dashboard-kbd">Ctrl K</kbd>{" "}
          để tìm kiếm nhanh
        </p>
      </section>

      {/* Stats Cards */}
      <section className="dashboard-stats">
        {stats.map((stat) => (
          <div key={stat.label} className={`glass-panel dashboard-stat-card ${stat.className}`}>
            <div className="stat-emoji">{stat.emoji}</div>
            <div className="stat-count">{stat.count}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Recent Articles */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">📝 Recent Articles</h2>
        {recentArticles.length > 0 ? (
          <div className="dashboard-recent">
            {recentArticles.map((article) => {
              const articlePath = article.folderSlug
                ? `/knowledge/${article.folderSlug}/${article.slug}`
                : `/knowledge/${article.slug}`;

              return (
                <Link
                  key={article.id}
                  href={articlePath}
                  className="glass-panel dashboard-article-item"
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="article-item-title">{article.title}</div>
                    <div className="article-item-meta">
                      {article.folderSlug && (
                        <>
                          <span className="article-item-category">
                            {article.folderSlug
                              .split("-")
                              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(" ")}
                          </span>
                          <span>·</span>
                        </>
                      )}
                      <span>{article.readingTime} min read</span>
                    </div>
                  </div>
                  <span className={`glass-pill status-${article.status}`} style={{ flexShrink: 0 }}>
                    {article.status}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-empty">
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📭</div>
            <p style={{ marginBottom: "1rem" }}>Chưa có bài viết nào</p>
            <Link href="/knowledge/editor" className="dashboard-cta-btn">
              📝 Tạo bài viết đầu tiên
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
