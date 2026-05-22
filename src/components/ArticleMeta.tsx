import type { ArticleFrontmatter } from "@/lib/knowledge";

interface ArticleMetaProps {
  frontmatter: ArticleFrontmatter;
  readingTime: number;
}

const STATUS_CONFIG: Record<string, { label: string; emoji: string; className: string }> = {
  learning: { label: "Learning", emoji: "📖", className: "status-learning" },
  reviewed: { label: "Reviewed", emoji: "🔍", className: "status-reviewed" },
  mastered: { label: "Mastered", emoji: "✅", className: "status-mastered" },
};

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "var(--diff-beginner)" },
  intermediate: { label: "Intermediate", color: "var(--diff-intermediate)" },
  advanced: { label: "Advanced", color: "var(--diff-advanced)" },
};

export default function ArticleMeta({ frontmatter, readingTime }: ArticleMetaProps) {
  const status = STATUS_CONFIG[frontmatter.status] || STATUS_CONFIG.learning;
  const difficulty = DIFFICULTY_CONFIG[frontmatter.difficulty] || DIFFICULTY_CONFIG.beginner;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Title */}
      <h1
        className="gradient-text"
        style={{
          fontSize: "2.25rem",
          fontWeight: 800,
          lineHeight: 1.2,
          marginBottom: "1rem",
          letterSpacing: "-0.03em",
        }}
      >
        {frontmatter.title}
      </h1>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {/* Status badge */}
        <span className={`glass-pill ${status.className}`}>
          {status.emoji} {status.label}
        </span>

        {/* Difficulty badge */}
        <span
          className="glass-pill"
          style={{ color: difficulty.color, borderColor: difficulty.color + "40" }}
        >
          {difficulty.label}
        </span>

        {/* Reading time */}
        <span className="glass-pill" style={{ color: "var(--text-muted)" }}>
          ⏱ {readingTime} min read
        </span>
      </div>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.375rem",
            marginBottom: "1rem",
          }}
        >
          {frontmatter.tags.map((tag) => (
            <span key={tag} className="glass-pill">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Dates */}
      {(frontmatter.created || frontmatter.updated) && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            display: "flex",
            gap: "1rem",
          }}
        >
          {frontmatter.created && (
            <span>Created: {formatDate(frontmatter.created)}</span>
          )}
          {frontmatter.updated && frontmatter.updated !== frontmatter.created && (
            <span>Updated: {formatDate(frontmatter.updated)}</span>
          )}
        </div>
      )}

      {/* Divider */}
      <hr
        style={{
          border: "none",
          height: "1px",
          background: "var(--glass-border)",
          marginTop: "1.5rem",
        }}
      />
    </div>
  );
}
