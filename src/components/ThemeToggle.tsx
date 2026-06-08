"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("mine-theme") as "dark" | "light" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.className = document.documentElement.className
        .replace(/\b(dark|light)\b/, stored);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("mine-theme", next);
    document.documentElement.className = document.documentElement.className
      .replace(/\b(dark|light)\b/, next);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="glass-pill"
      style={{
        cursor: "pointer",
        padding: "0.5rem",
        fontSize: "1.125rem",
        lineHeight: 1,
        transition: "transform var(--transition-fast)",
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.9)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
