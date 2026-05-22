"use client";

import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

interface NavbarProps {
  onSearchOpen?: () => void;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
}

export default function Navbar({ onSearchOpen, onSidebarToggle, sidebarOpen }: NavbarProps) {
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
      </div>
    </nav>
  );
}
