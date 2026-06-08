"use client";

import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/lib/actions/auth";

interface NavbarProps {
  onSearchOpen?: () => void;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
  user?: {
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

export default function Navbar({ onSearchOpen, onSidebarToggle, sidebarOpen, user }: NavbarProps) {
  return (
    <nav
      className="glass-panel navbar"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Left: Hamburger + Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {/* Hamburger — visible on mobile only */}
        <button
          className="hamburger-btn"
          onClick={onSidebarToggle}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {sidebarOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>

        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🫧</span>
          <span
            className="gradient-text"
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Mine KB
          </span>
        </Link>
      </div>

      {/* Right section */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Search trigger */}
        <button
          className="glass-pill search-trigger"
          onClick={onSearchOpen}
          aria-label="Search knowledge base"
          role="search"
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="search-trigger-text">Search...</span>
          <kbd className="search-trigger-kbd">Ctrl K</kbd>
        </button>

        <ThemeToggle />

        {/* User menu */}
        {user && (
          <div className="navbar-user">
            <div className="navbar-avatar">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.displayName || "Avatar"}
                  width={32}
                  height={32}
                  className="navbar-avatar-img"
                />
              ) : (
                <div className="navbar-avatar-fallback">
                  {(user.displayName || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="navbar-logout-btn"
                title="Đăng xuất"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
