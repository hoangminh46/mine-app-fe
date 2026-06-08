"use client";

import { useEffect, useRef } from "react";
import CodeBlock from "./CodeBlock";
import { createRoot } from "react-dom/client";

interface MarkdownContentProps {
  htmlContent: string;
}

export default function MarkdownContent({ htmlContent }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const preElements = containerRef.current.querySelectorAll("pre");
    const roots: ReturnType<typeof createRoot>[] = [];

    preElements.forEach((pre) => {
      const codeEl = pre.querySelector("code");
      if (!codeEl) return;

      // Step 1: Extract language from class (e.g., "hljs language-python")
      const classes = codeEl.className || "";
      const langMatch = classes.match(/language-(\S+)/);
      const language = langMatch ? langMatch[1] : "text";

      // Step 2: Get the rendered HTML (with highlight.js spans) for display
      const codeHtml = codeEl.innerHTML;

      // Step 3: Get plain text for copy
      const codeText = codeEl.textContent || "";

      // Step 4: Create wrapper and mount CodeBlock
      const wrapper = document.createElement("div");
      pre.parentNode?.replaceChild(wrapper, pre);

      const root = createRoot(wrapper);
      root.render(
        <CodeBlockWrapper language={language} codeHtml={codeHtml} codeText={codeText} />
      );
      roots.push(root);
    });

    return () => {
      roots.forEach((root) => {
        // React 19: defer unmount to avoid synchronous unmount during render
        setTimeout(() => root.unmount(), 0);
      });
    };
  }, [htmlContent]);

  return (
    <article
      className="prose"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

// Thin wrapper to pass correct props to CodeBlock
function CodeBlockWrapper({
  language,
  codeHtml,
  codeText,
}: {
  language: string;
  codeHtml: string;
  codeText: string;
}) {
  return <CodeBlock language={language} codeText={codeText} codeHtml={codeHtml} />;
}
