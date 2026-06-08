"use client";

import { useState, useEffect, useCallback } from "react";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      setProgress(0);
      return;
    }
    const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    setProgress(scrollPercent);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", onScroll);
  }, [updateProgress]);

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
