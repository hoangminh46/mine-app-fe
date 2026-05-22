import Link from "next/link";
import type { ArticleListItem } from "@/lib/types";

interface FolderListingProps {
  folderName: string;
  articles: ArticleListItem[];
}

export default function FolderListing({ folderName, articles }: FolderListingProps) {
  const displayName = folderName
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (articles.length === 0) {
    return (
      <div className="folder-empty">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📂</div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Chưa có bài viết nào
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Click <strong>📝</strong> ở sidebar để tạo bài viết mới trong folder này.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="gradient-text" style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        {displayName}
      </h1>
      <div className="folder-grid">
        {articles.map((article) => {
          const excerpt = article.excerpt.slice(0, 100) + (article.excerpt.length > 100 ? "..." : "");

          return (
            <Link
              key={article.slug}
              href={`/knowledge/${article.slug}`}
              className="glass-panel folder-card"
            >
              <div className="folder-card-header">
                <h3 className="folder-card-title">{article.frontmatter.title}</h3>
                <span className={`glass-pill status-${article.frontmatter.status}`} style={{ fontSize: "0.625rem" }}>
                  {article.frontmatter.status}
                </span>
              </div>

              <p className="folder-card-excerpt">{excerpt}</p>

              <div className="folder-card-footer">
                <span className="glass-pill" style={{ fontSize: "0.625rem" }}>
                  {article.frontmatter.difficulty}
                </span>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                  {article.readingTime} min read
                </span>
              </div>

              {article.frontmatter.tags.length > 0 && (
                <div className="folder-card-tags">
                  {article.frontmatter.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="glass-pill" style={{ fontSize: "0.5625rem", padding: "0.1rem 0.35rem" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
