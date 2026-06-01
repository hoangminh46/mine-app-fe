export default function DashboardLoading() {
  return (
    <div className="dashboard">
      {/* Hero skeleton */}
      <section className="dashboard-hero">
        <div
          className="skeleton skeleton-title"
          style={{ width: "60%", height: "2.75rem", margin: "0 auto 0.75rem" }}
        />
        <div
          className="skeleton skeleton-text"
          style={{ width: "40%", margin: "0 auto" }}
        />
      </section>

      {/* Stats cards skeleton */}
      <section className="dashboard-stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton skeleton-card" style={{ padding: "1.25rem" }}>
            <div
              className="skeleton"
              style={{ width: "2rem", height: "2rem", borderRadius: "50%", margin: "0 auto 0.5rem" }}
            />
            <div
              className="skeleton skeleton-title"
              style={{ width: "3rem", margin: "0 auto 0.25rem" }}
            />
            <div
              className="skeleton skeleton-text-sm"
              style={{ width: "4rem", margin: "0 auto" }}
            />
          </div>
        ))}
      </section>

      {/* Recent articles skeleton */}
      <section className="dashboard-section">
        <div
          className="skeleton skeleton-text"
          style={{ width: "10rem", marginBottom: "1rem" }}
        />
        <div className="dashboard-recent">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="skeleton skeleton-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.875rem 1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  className="skeleton skeleton-text"
                  style={{ width: `${60 + i * 5}%`, marginBottom: "0.375rem" }}
                />
                <div
                  className="skeleton skeleton-text-sm"
                  style={{ width: "30%" }}
                />
              </div>
              <div
                className="skeleton"
                style={{ width: "4rem", height: "1.25rem", borderRadius: "9999px" }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
