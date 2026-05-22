"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import SearchModal from "./SearchModal";
import type { SearchItem } from "@/lib/search";

interface AppShellProps {
  searchIndex: SearchItem[];
  children: React.ReactNode;
  user?: {
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

export default function AppShell({ searchIndex, children, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearchOpen = () => {
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Sidebar closes via 'sidebar-close' event dispatched from Sidebar link clicks

  // Expose sidebar state via custom events for layout components
  useEffect(() => {
    const handleOpen = () => setSidebarOpen(true);
    const handleClose = () => setSidebarOpen(false);

    window.addEventListener("sidebar-open", handleOpen);
    window.addEventListener("sidebar-close", handleClose);

    return () => {
      window.removeEventListener("sidebar-open", handleOpen);
      window.removeEventListener("sidebar-close", handleClose);
    };
  }, []);

  // Prevent body scroll when sidebar overlay is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    <>
      <Navbar
        onSearchOpen={handleSearchOpen}
        onSidebarToggle={handleSidebarToggle}
        sidebarOpen={sidebarOpen}
        user={user}
      />
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={handleSidebarClose}
          aria-hidden="true"
        />
      )}
      <div className={sidebarOpen ? "sidebar-open" : ""}>
        {children}
      </div>
      <SearchModal searchIndex={searchIndex} />
    </>
  );
}
