# Phase 04: Article Page & Markdown Rendering
Status: ✅ Complete
Dependencies: Phase 02, Phase 03

## Objective
Tạo trang hiển thị bài viết: dynamic route, render markdown với typography đẹp, và hiển thị article metadata.

## Why This Phase Exists
Đây là nơi user đọc bài — core experience. Tập trung vào rendering chính xác và typography dễ đọc trước, enhancement (code blocks, progress) ở phase sau.

## Scope
### In Scope
- Dynamic catch-all route `[[...slug]]`
- `generateStaticParams()` cho static generation
- MarkdownContent component (render HTML)
- Prose CSS styles (headings, paragraphs, lists, tables, blockquotes, links, images)
- ArticleMeta component (tags, status, difficulty, dates, reading time)
- Assemble article page layout

### Out of Scope
- CodeBlock enhancement + copy button (phase 05)
- ProgressBar (phase 05)
- TOC (phase 06)

## Requirements
### Functional
- [ ] URL `/knowledge/ai/prompt-engineering` → render bài viết đúng
- [ ] Markdown elements rendered đẹp: headings, paragraphs, lists, tables, blockquotes, links, images
- [ ] Article meta hiển thị: title, tags (pill badges), difficulty badge, status badge, dates, reading time

### Non-Functional
- [ ] Typography: Inter font, line-height 1.75, max-width 720px
- [ ] Static generation: tất cả pages built at build time
- [ ] Prose styles viết vanilla CSS (full control)

## Implementation Steps
1. [ ] Tạo `src/app/knowledge/[[...slug]]/page.tsx` — dynamic route, nhận params, gọi `getArticle()`
2. [ ] Implement `generateStaticParams()` — gọi `getAllArticles()`, map sang slug arrays
3. [ ] Tạo `MarkdownContent.tsx` — nhận HTML string, render với `dangerouslySetInnerHTML`, wrap trong `.prose` container
4. [ ] Style markdown prose trong `globals.css` — headings (h1–h4 sizes, spacing), paragraphs (line-height), lists (custom markers), tables (glass borders), blockquotes (violet left border), links (cyan, hover underline), images (rounded + shadow)
5. [ ] Tạo `ArticleMeta.tsx` — tags as glass pills, difficulty badge (green/yellow/red), status badge (blue/amber/emerald), created/updated dates, reading time estimate
6. [ ] Assemble article page — layout: Breadcrumb → ArticleMeta → MarkdownContent, test với sample content

## Files to Create/Modify
- `src/app/knowledge/[[...slug]]/page.tsx` — Article page (NEW)
- `src/components/MarkdownContent.tsx` — Markdown renderer (NEW)
- `src/components/ArticleMeta.tsx` — Article metadata display (NEW)
- `src/app/globals.css` — Prose styles (MODIFY)

## Acceptance Criteria
- [ ] Navigate to `/knowledge/ai/prompt-engineering` → bài viết render đầy đủ
- [ ] Headings, paragraphs, lists, tables, blockquotes, links đều styled đúng
- [ ] Tags hiển thị dạng pill badges, difficulty + status có color coding
- [ ] Reading time hiển thị (VD: "5 min read")
- [ ] `pnpm build` thành công — tất cả article pages generated

## Test Criteria
- [ ] Render bài mẫu có nhiều elements → tất cả styled đúng
- [ ] Bài không có frontmatter → vẫn render được với fallback values
- [ ] Navigate giữa các articles → content update đúng

## Definition of Done
- [ ] Dynamic route hoạt động
- [ ] 2 components tạo xong
- [ ] Prose styles hoàn chỉnh
- [ ] Build thành công

## Assumptions / Notes
- Code blocks sẽ có syntax highlighting cơ bản từ `rehype-highlight` (đã setup trong phase 02), nhưng CodeBlock wrapper + copy button ở phase 05
- Prose styles viết vanilla CSS trong globals.css, không dùng @tailwindcss/typography

---
Next Phase: Phase 05 — Code Blocks & Reading UX
