"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { KnowledgeNode } from "@/lib/knowledge";

interface SidebarProps {
  tree: KnowledgeNode[];
}

export default function Sidebar({ tree }: SidebarProps) {
  return (
    <aside
      className="glass-panel sidebar"
      role="navigation"
      aria-label="Knowledge sidebar"
    >
      {/* Header */}
      <div
        style={{
          padding: "0 1rem 0.75rem",
          fontSize: "0.6875rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
        }}
      >
        Knowledge Base
      </div>

      {/* Tree */}
      <nav>
        {tree.map((node) => (
          <TreeNode key={node.slug} node={node} depth={0} />
        ))}
      </nav>

      {/* Empty state */}
      {tree.length === 0 && (
        <div
          style={{
            padding: "2rem 1rem",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.8125rem",
          }}
        >
          Chưa có bài viết nào
        </div>
      )}
    </aside>
  );
}

// ──────────────────────────────────────────────
// TreeNode — Recursive tree item
// ──────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  learning: "var(--status-learning)",
  reviewed: "var(--status-reviewed)",
  mastered: "var(--status-mastered)",
};

interface TreeNodeProps {
  node: KnowledgeNode;
  depth: number;
}

function TreeNode({ node, depth }: TreeNodeProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const isFolder = node.type === "folder";
  const articlePath = `/knowledge/${node.slug}`;
  const isActive = pathname === articlePath;

  // Check if any child is active (for folder highlight)
  const hasActiveChild = isFolder && pathname?.startsWith(`/knowledge/${node.slug}/`);

  if (isFolder) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: `0.4rem 1rem 0.4rem ${1 + depth * 0.75}rem`,
            border: "none",
            background: hasActiveChild ? "var(--glass-bg)" : "transparent",
            color: hasActiveChild ? "var(--text-primary)" : "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "0.8125rem",
            fontWeight: 600,
            textAlign: "left",
            transition: "background var(--transition-fast), color var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            if (!hasActiveChild) e.currentTarget.style.background = "var(--glass-bg-hover)";
          }}
          onMouseLeave={(e) => {
            if (!hasActiveChild) e.currentTarget.style.background = "transparent";
          }}
        >
          {/* Chevron */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
              flexShrink: 0,
            }}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>

          {/* Folder icon */}
          <span style={{ fontSize: "0.875rem", flexShrink: 0 }}>
            {isExpanded ? "📂" : "📁"}
          </span>

          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {node.title}
          </span>
        </button>

        {/* Children */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: isExpanded ? "500px" : "0px",
            transition: "max-height 200ms ease",
          }}
        >
          {node.children?.map((child) => (
            <TreeNode key={child.slug} node={child} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  // Article node
  return (
    <Link
      href={articlePath}
      onClick={() => window.dispatchEvent(new CustomEvent("sidebar-close"))}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: `0.4rem 1rem 0.4rem ${1 + depth * 0.75 + 0.375}rem`,
        textDecoration: "none",
        fontSize: "0.8125rem",
        fontWeight: isActive ? 600 : 400,
        color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
        background: isActive ? "var(--glass-bg-active)" : "transparent",
        borderRight: isActive ? "2px solid var(--accent-primary)" : "2px solid transparent",
        transition: "all var(--transition-fast)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "var(--glass-bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Status dot */}
      {node.status && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: STATUS_COLORS[node.status] || "var(--text-muted)",
            flexShrink: 0,
          }}
        />
      )}

      {/* Title */}
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {node.title}
      </span>
    </Link>
  );
}
