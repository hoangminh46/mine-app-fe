# Phase 05: Code Blocks & Reading UX
Status: ✅ Complete
Dependencies: Phase 04

## Objective
Nâng cấp code blocks (glass card + copy button) và thêm reading progress bar. Tập trung vào trải nghiệm đọc bài.

## Why This Phase Exists
Code blocks là element được dùng nhiều nhất trong kiến thức lập trình. Copy button giúp tái sử dụng nhanh. Progress bar giúp biết đang đọc tới đâu.

## Scope
### In Scope
- CodeBlock component (glass card, language label)
- Copy button + "Copied!" tooltip
- Syntax highlighting theme customization
- ProgressBar component (scroll-based)
- Integration vào MarkdownContent

### Out of Scope
- Line numbers trong code blocks (v2)
- Code block collapse/expand (v2)

## Requirements
### Functional
- [ ] Code blocks hiển thị trong glass card với language label
- [ ] Hover code block → copy button hiện
- [ ] Click copy → nội dung copied, tooltip "Copied!" hiện 2s
- [ ] Progress bar ở top page: gradient violet→cyan, cập nhật khi scroll

### Non-Functional
- [ ] Copy dùng `navigator.clipboard.writeText()`
- [ ] Scroll listener throttled (requestAnimationFrame)
- [ ] Glass effect trên code blocks subtle, không gây mỏi mắt

## Implementation Steps
1. [ ] Tạo `CodeBlock.tsx` — client component, glass card background, detect language từ class, hiển thị language label top-right
2. [ ] Thêm copy button vào CodeBlock — click handler copy `textContent`, show "Copied!" tooltip, reset sau 2s
3. [ ] Import và customize highlight.js CSS theme — override colors cho Liquid Glass look (softer, match dark/light mode)
4. [ ] Tạo `ProgressBar.tsx` — client component, listen scroll event (throttled), calculate scroll %, render thin bar `position: fixed` top, gradient fill violet→cyan
5. [ ] Integrate CodeBlock vào article page — post-process rendered HTML hoặc dùng custom rehype plugin để wrap `<pre><code>` blocks, thêm ProgressBar vào knowledge layout

## Files to Create/Modify
- `src/components/CodeBlock.tsx` — Code block with glass + copy (NEW)
- `src/components/ProgressBar.tsx` — Reading progress bar (NEW)
- `src/app/globals.css` — Highlight.js theme overrides (MODIFY)
- `src/app/knowledge/[[...slug]]/page.tsx` — Add ProgressBar (MODIFY)
- `src/components/MarkdownContent.tsx` — Integrate CodeBlock (MODIFY)

## Acceptance Criteria
- [ ] Code blocks có glass card background + language label
- [ ] Hover → copy button hiện, click → "Copied!" tooltip
- [ ] Copy → paste vào editor → nội dung chính xác
- [ ] Scroll xuống → progress bar fill, scroll hết → 100%
- [ ] Syntax colors đẹp, hài hòa với theme

## Test Criteria
- [ ] Code block có nhiều ngôn ngữ (JS, Python, bash) → highlight đúng
- [ ] Copy code block rỗng → không crash
- [ ] Dark/Light mode → code block + progress bar đều đẹp

## Definition of Done
- [ ] CodeBlock component hoàn chỉnh
- [ ] ProgressBar component hoàn chỉnh
- [ ] Highlight.js theme customized
- [ ] Integrated vào article page

## Assumptions / Notes
- CodeBlock và ProgressBar là client components (`'use client'`)
- Copy dùng `navigator.clipboard.writeText()` — fallback `document.execCommand('copy')` nếu cần
- Progress bar height: 3px, z-index cao hơn navbar

---
Next Phase: Phase 06 — Table of Contents
