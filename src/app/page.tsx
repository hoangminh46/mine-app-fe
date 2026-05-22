import Link from "next/link";
import { getAllArticles } from "@/lib/knowledge";

export default async function DashboardPage() {
  const articles = await getAllArticles();

  // Stats
  const total = articles.length;
  const learningCount = articles.filter((a) => a.frontmatter.status === "learning").length;
  const reviewedCount = articles.filter((a) => a.frontmatter.status === "reviewed").length;
  const masteredCount = articles.filter((a) => a.frontmatter.status === "mastered").length;

  // Recent articles sorted by updated date
  const recentArticles = [...articles]
    .sort((a, b) => {
      const dateA = a.frontmatter.updated || a.frontmatter.created || "";
      const dateB = b.frontmatter.updated || b.frontmatter.created || "";
      return new Date(String(dateB)).getTime() - new Date(String(dateA)).getTime();
    })
    .slice(0, 5);

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
              const category = article.slug.split("/")[0] || "";
              const categoryLabel = category
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

              return (
                <Link
                  key={article.slug}
                  href={`/knowledge/${article.slug}`}
                  className="glass-panel dashboard-article-item"
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="article-item-title">{article.frontmatter.title}</div>
                    <div className="article-item-meta">
                      <span className="article-item-category">{categoryLabel}</span>
                      <span>·</span>
                      <span>{article.readingTime} min read</span>
                    </div>
                  </div>
                  <span className={`glass-pill status-${article.frontmatter.status}`} style={{ flexShrink: 0 }}>
                    {article.frontmatter.status}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-empty">
            <div style={{ fontSize: "2rem" }}>📭</div>
            <p>Chưa có bài viết nào</p>
          </div>
        )}
      </section>

      {/* Quick Start */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">🚀 Quick Start</h2>
        <div className="dashboard-quick-start glass-panel">
          <p>
            Thêm file <code>.md</code> vào thư mục <code>docs/knowledge/</code> để bắt đầu.
            Tạo thư mục con để phân loại theo chủ đề.
          </p>
        </div>
      </section>
    </div>
  );
}
