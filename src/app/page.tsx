import Link from "next/link";
import { getAllUserArticles, getDashboardData } from "@/lib/db/queries/articles";

export default async function DashboardPage() {
  const [articles, dashboardData] = await Promise.all([
    getAllUserArticles(),
    getDashboardData(),
  ]);

  const { folders, popularTags } = dashboardData;
  const hasFolders = folders.length > 0;

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
      {/* Hero Section + Quick Actions */}
      <section className="dashboard-hero">
        <h1 className="dashboard-title gradient-text">
          Mine Knowledge Base
        </h1>
        <p className="dashboard-subtitle">
          Lưu trữ, tổ chức và học tập kiến thức hiệu quả
        </p>
        <div className="dashboard-actions">
          {hasFolders ? (
            <Link href="/knowledge/editor" className="dashboard-action-btn dashboard-action-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Bài viết mới
            </Link>
          ) : (
            <Link href="/knowledge" className="dashboard-action-btn dashboard-action-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Tạo folder đầu tiên
            </Link>
          )}
          <span className="dashboard-action-divider">hoặc</span>
          <kbd className="dashboard-kbd">Ctrl K</kbd>
          <span className="dashboard-action-hint">để tìm kiếm nhanh</span>
        </div>
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

      {/* Folders + Recent: 2-column layout */}
      <div className="dashboard-grid">
        {/* Folders Overview */}
        {folders.length > 0 && (
          <section className="dashboard-section">
            <h2 className="dashboard-section-title">📂 Folders</h2>
            <div className="dashboard-folders">
              {folders.map((folder) => (
                <Link
                  key={folder.id}
                  href={`/knowledge/${folder.slug}`}
                  className="glass-panel dashboard-folder-card"
                >
                  <div className="dashboard-folder-icon">📁</div>
                  <div className="dashboard-folder-info">
                    <span className="dashboard-folder-name">{folder.name}</span>
                    <span className="dashboard-folder-count">
                      {folder.articleCount} {folder.articleCount === 1 ? "bài" : "bài"}
                    </span>
                  </div>
                  {folder.latestArticleTitle && (
                    <div className="dashboard-folder-latest" title={folder.latestArticleTitle}>
                      {folder.latestArticleTitle}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

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
                        {article.folderName && (
                          <>
                            <span className="article-item-category">
                              {article.folderName}
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
              {hasFolders ? (
                <>
                  <p style={{ marginBottom: "1rem" }}>Chưa có bài viết nào</p>
                  <Link href="/knowledge/editor" className="dashboard-cta-btn">
                    📝 Tạo bài viết đầu tiên
                  </Link>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: "1rem" }}>Hãy tạo folder để bắt đầu tổ chức kiến thức</p>
                  <Link href="/knowledge" className="dashboard-cta-btn">
                    📂 Tạo folder đầu tiên
                  </Link>
                </>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">🏷️ Popular Tags</h2>
          <div className="dashboard-tags">
            {popularTags.map(({ tag, count }) => (
              <span key={tag} className="glass-panel dashboard-tag">
                <span className="dashboard-tag-name">#{tag}</span>
                <span className="dashboard-tag-count">{count}</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
