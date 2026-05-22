"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { SidebarFolder, SidebarArticle } from "@/lib/db/queries/folders";
import { deleteFolder, getFolderArticleCount, renameFolder } from "@/lib/actions/folders";
import FolderDialog from "./FolderDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const STATUS_COLORS: Record<string, string> = {
  learning: "var(--status-learning)",
  reviewed: "var(--status-reviewed)",
  mastered: "var(--status-mastered)",
};

interface SidebarProps {
  folders: SidebarFolder[];
  rootArticles: SidebarArticle[];
}

export default function Sidebar({ folders, rootArticles }: SidebarProps) {
  const isEmpty = folders.length === 0 && rootArticles.length === 0;
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <aside
      className="glass-panel sidebar"
      role="navigation"
      aria-label="Knowledge sidebar"
    >
      {/* Header with action buttons */}
      <div className="sidebar-header">
        <span className="sidebar-header-label">Knowledge Base</span>
        <div style={{ display: "flex", gap: "4px" }}>
          <Link
            href="/knowledge/editor"
            className="sidebar-add-btn"
            title="Bài viết mới"
          >
            📝
          </Link>
          <button
            className="sidebar-add-btn"
            onClick={() => setShowCreateDialog(true)}
            title="Tạo folder mới"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tree */}
      <nav>
        {folders.map((folder) => (
          <FolderNode key={folder.id} folder={folder} depth={0} />
        ))}
        {rootArticles.map((article) => (
          <ArticleNode key={article.id} article={article} depth={0} />
        ))}
      </nav>

      {/* Empty state */}
      {isEmpty && (
        <div
          style={{
            padding: "2rem 1rem",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.8125rem",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📂</div>
          <p>Chưa có folder nào</p>
          <button
            className="sidebar-create-hint"
            onClick={() => setShowCreateDialog(true)}
          >
            + Tạo folder đầu tiên
          </button>
        </div>
      )}

      {showCreateDialog && (
        <FolderDialog
          mode="create"
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
    </aside>
  );
}

// ──────────────────────────────────────────────
// FolderNode — Recursive folder item with actions
// ──────────────────────────────────────────────

interface FolderNodeProps {
  folder: SidebarFolder;
  depth: number;
}

function FolderNode({ folder, depth }: FolderNodeProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [articleCount, setArticleCount] = useState<number | null>(null);

  const hasActiveChild = pathname?.includes(`/knowledge/`) &&
    (folder.articles.some((a) => pathname === `/knowledge/${folder.slug}/${a.slug}`) ||
     folder.children.some((c) => pathname?.startsWith(`/knowledge/${c.slug}/`)));

  async function handleDeleteClick() {
    const count = await getFolderArticleCount(folder.id);
    setArticleCount(count);
    setShowDeleteDialog(true);
  }

  async function handleDeleteConfirm() {
    await deleteFolder(folder.id);
    router.refresh();
  }

  return (
    <div>
      <div className="sidebar-folder-row">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="sidebar-folder-btn"
          style={{
            paddingLeft: `${1 + depth * 0.75}rem`,
            background: hasActiveChild ? "var(--glass-bg)" : "transparent",
            color: hasActiveChild ? "var(--text-primary)" : "var(--text-secondary)",
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

          <span style={{ fontSize: "0.875rem", flexShrink: 0 }}>
            {isExpanded ? "📂" : "📁"}
          </span>

          <span className="sidebar-folder-name">{folder.name}</span>
        </button>

        {/* Action buttons */}
        <div className="sidebar-folder-actions">
          <button
            className="sidebar-action-btn"
            onClick={() => setShowRenameDialog(true)}
            title="Đổi tên"
          >
            ✏️
          </button>
          <button
            className="sidebar-action-btn"
            onClick={handleDeleteClick}
            title="Xóa"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Children */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: isExpanded ? "500px" : "0px",
          transition: "max-height 200ms ease",
        }}
      >
        {folder.children.map((child) => (
          <FolderNode key={child.id} folder={child} depth={depth + 1} />
        ))}
        {folder.articles.map((article) => (
          <ArticleNode
            key={article.id}
            article={article}
            depth={depth + 1}
            folderSlug={folder.slug}
          />
        ))}
      </div>

      {showRenameDialog && (
        <FolderDialog
          mode="rename"
          isOpen={showRenameDialog}
          onClose={() => setShowRenameDialog(false)}
          folderId={folder.id}
          currentName={folder.name}
        />
      )}

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Xóa folder"
        message={
          articleCount && articleCount > 0
            ? `Folder "${folder.name}" có ${articleCount} bài viết. Xóa folder sẽ xóa tất cả bài viết bên trong.`
            : `Bạn có chắc muốn xóa folder "${folder.name}"?`
        }
      />
    </div>
  );
}

// ──────────────────────────────────────────────
// ArticleNode — Article link item
// ──────────────────────────────────────────────

interface ArticleNodeProps {
  article: SidebarArticle;
  depth: number;
  folderSlug?: string;
}

function ArticleNode({ article, depth, folderSlug }: ArticleNodeProps) {
  const pathname = usePathname();
  const articlePath = folderSlug
    ? `/knowledge/${folderSlug}/${article.slug}`
    : `/knowledge/${article.slug}`;
  const isActive = pathname === articlePath;

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
      {article.status && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: STATUS_COLORS[article.status] || "var(--text-muted)",
            flexShrink: 0,
          }}
        />
      )}

      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {article.title}
      </span>
    </Link>
  );
}
