"use client";

import Link from "next/link";

interface BreadcrumbProps {
  slugParts: string[];
}

export default function Breadcrumb({ slugParts }: BreadcrumbProps) {
  if (slugParts.length === 0) return null;

  const crumbs = slugParts.map((part, index) => {
    const href = "/knowledge/" + slugParts.slice(0, index + 1).join("/");
    const label = part
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const isLast = index === slugParts.length - 1;

    return { href, label, isLast };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        fontSize: "0.8125rem",
        color: "var(--text-muted)",
        flexWrap: "wrap",
      }}
    >
      {/* Home */}
      <Link
        href="/"
        style={{
          color: "var(--text-muted)",
          textDecoration: "none",
          transition: "color var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        🏠
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          {/* Separator */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.5 }}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>

          {crumb.isLast ? (
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
