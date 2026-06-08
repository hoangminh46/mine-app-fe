export default function KnowledgeLoading() {
  return (
    <div className="article-layout">
      <div className="article-content">
        {/* Breadcrumb skeleton */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <div className="skeleton skeleton-text-sm" style={{ width: "4rem" }} />
          <div className="skeleton skeleton-text-sm" style={{ width: "6rem" }} />
        </div>

        {/* Article title skeleton */}
        <div
          className="skeleton skeleton-title"
          style={{ width: "70%", height: "2rem", marginBottom: "1rem" }}
        />

        {/* Article meta skeleton */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          <div
            className="skeleton"
            style={{ width: "5rem", height: "1.25rem", borderRadius: "9999px" }}
          />
          <div
            className="skeleton"
            style={{ width: "4rem", height: "1.25rem", borderRadius: "9999px" }}
          />
          <div
            className="skeleton"
            style={{ width: "6rem", height: "1.25rem", borderRadius: "9999px" }}
          />
        </div>

        {/* Content skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="skeleton skeleton-text" style={{ width: "100%" }} />
          <div className="skeleton skeleton-text" style={{ width: "95%" }} />
          <div className="skeleton skeleton-text" style={{ width: "88%" }} />
          <div className="skeleton skeleton-text" style={{ width: "92%" }} />
          <div style={{ height: "0.5rem" }} />
          <div className="skeleton skeleton-text" style={{ width: "100%" }} />
          <div className="skeleton skeleton-text" style={{ width: "85%" }} />
          <div className="skeleton skeleton-text" style={{ width: "90%" }} />
          <div className="skeleton skeleton-text" style={{ width: "78%" }} />
          <div style={{ height: "0.5rem" }} />
          <div
            className="skeleton"
            style={{ width: "100%", height: "8rem", borderRadius: "var(--radius-md)" }}
          />
          <div style={{ height: "0.5rem" }} />
          <div className="skeleton skeleton-text" style={{ width: "95%" }} />
          <div className="skeleton skeleton-text" style={{ width: "88%" }} />
          <div className="skeleton skeleton-text" style={{ width: "72%" }} />
        </div>
      </div>
    </div>
  );
}
