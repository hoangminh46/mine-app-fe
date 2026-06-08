"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { SearchItem } from "@/lib/search";

interface SearchModalProps {
  searchIndex: SearchItem[];
}

export default function SearchModal({ searchIndex }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fuse.js instance
  const fuseRef = useRef<Fuse<SearchItem> | null>(null);

  useEffect(() => {
    fuseRef.current = new Fuse(searchIndex, {
      keys: ["title", "tags", "excerpt"],
      threshold: 0.4,
      includeMatches: true,
    });
  }, [searchIndex]);

  // Ctrl+K / ⌘K shortcut + custom event from Navbar button
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    const handleOpenSearch = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-search", handleOpenSearch);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-search", handleOpenSearch);
    };
  }, []);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    if (query.trim() === "") {
      // Show all items when no query
      setResults(searchIndex.slice(0, 10));
      setSelectedIndex(0);
      return;
    }

    const timer = setTimeout(() => {
      if (!fuseRef.current) return;
      const fuseResults = fuseRef.current.search(query, { limit: 10 });
      setResults(fuseResults.map((r) => r.item));
      setSelectedIndex(0);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen, searchIndex]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const navigateTo = useCallback(
    (slug: string) => {
      router.push(`/knowledge/${slug}`);
      close();
    },
    [router, close]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev <= 0 ? Math.max(0, results.length - 1) : prev - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            navigateTo(results[selectedIndex].slug);
          }
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    },
    [results, selectedIndex, navigateTo, close]
  );

  if (!isOpen) return null;

  return (
    <div className="search-backdrop" onClick={close}>
      <div
        className="search-modal glass-panel"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="search-input-wrapper">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="search-input"
            autoComplete="off"
          />
          <kbd className="search-kbd">Esc</kbd>
        </div>

        {/* Results */}
        <div className="search-results">
          {results.length > 0 ? (
            results.map((item, index) => (
              <button
                key={item.slug}
                className={`search-result-item ${
                  index === selectedIndex ? "search-result-active" : ""
                }`}
                onClick={() => navigateTo(item.slug)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="search-result-title">{item.title}</div>
                <div className="search-result-meta">
                  <span className="search-result-category">{item.category}</span>
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="glass-pill" style={{ fontSize: "0.625rem", padding: "0.1rem 0.4rem" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </button>
            ))
          ) : query.trim() !== "" ? (
            <div className="search-empty">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
              <div>Không tìm thấy kết quả</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Thử tìm với từ khóa khác
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer hint */}
        <div className="search-footer">
          <span>
            <kbd className="search-kbd-sm">↑↓</kbd> di chuyển
          </span>
          <span>
            <kbd className="search-kbd-sm">↵</kbd> mở bài
          </span>
          <span>
            <kbd className="search-kbd-sm">Esc</kbd> đóng
          </span>
        </div>
      </div>
    </div>
  );
}
