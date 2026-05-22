"use client";

import { useState, useEffect, useCallback } from "react";
import type { Heading } from "@/lib/knowledge";

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  // Scroll spy — find heading closest to top of viewport on scroll
  useEffect(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    const navbarOffset = 100;
    let rafId = 0;

    const updateActiveHeading = () => {
      let currentId = headingElements[0].id;
      for (const el of headingElements) {
        if (el.getBoundingClientRect().top <= navbarOffset) {
          currentId = el.id;
        } else {
          break;
        }
      }
      setActiveId(currentId);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveHeading);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateActiveHeading();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [headings]);

  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Highlight immediately on click
    setActiveId(id);

    // Offset for navbar height
    const navbarHeight = 60;
    const elementTop = element.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({
      top: elementTop,
      behavior: "smooth",
    });
  }, []);

  // Hide TOC when less than 3 headings
  if (headings.length < 3) return null;

  return (
    <nav
      className="toc-container glass-panel"
      aria-label="Table of Contents"
    >
      <div className="toc-title">On this page</div>

      <ul className="toc-list">
        {headings.map((heading) => {
          const indent = heading.level - 2; // h2=0, h3=1, h4=2
          const isActive = activeId === heading.id;

          return (
            <li key={heading.id}>
              <button
                onClick={() => handleClick(heading.id)}
                className={`toc-item ${isActive ? "toc-item-active" : ""}`}
                style={{
                  paddingLeft: `${0.75 + indent * 0.75}rem`,
                }}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
