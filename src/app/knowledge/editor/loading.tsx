export default function EditorLoading() {
  return (
    <div className="editor-page">
      {/* Header skeleton */}
      <div className="editor-header">
        <div
          className="skeleton"
          style={{ width: "5rem", height: "2rem", borderRadius: "var(--radius-sm)" }}
        />
        <div
          className="skeleton skeleton-title"
          style={{ width: "8rem" }}
        />
        <div
          className="skeleton"
          style={{ width: "4.5rem", height: "2rem", borderRadius: "var(--radius-sm)" }}
        />
      </div>

      {/* Title input skeleton */}
      <div
        className="skeleton"
        style={{
          width: "100%",
          height: "3rem",
          borderRadius: "var(--radius-md)",
          marginBottom: "1rem",
        }}
      />

      {/* Meta row skeleton */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div
          className="skeleton"
          style={{ width: "10rem", height: "2.25rem", borderRadius: "var(--radius-sm)" }}
        />
        <div
          className="skeleton"
          style={{ width: "8rem", height: "2.25rem", borderRadius: "var(--radius-sm)" }}
        />
        <div
          className="skeleton"
          style={{ width: "8rem", height: "2.25rem", borderRadius: "var(--radius-sm)" }}
        />
        <div
          className="skeleton"
          style={{ flex: 1, minWidth: "8rem", height: "2.25rem", borderRadius: "var(--radius-sm)" }}
        />
      </div>

      {/* Editor area skeleton */}
      <div
        className="skeleton"
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "var(--radius-md)",
        }}
      />
    </div>
  );
}
