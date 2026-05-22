# Phase 02: Core Library & Sample Content
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Xây dựng core library để đọc/parse file markdown và tạo sample content để test.

## Why This Phase Exists
Tất cả các trang (article, sidebar, search, dashboard) đều phụ thuộc vào dữ liệu từ file .md. Tạo lib xử lý trước giúp các phase UI sau có data sẵn để render.

## Scope
### In Scope
- Type definitions cho knowledge tree
- Đọc folder structure → tree
- Parse .md file → frontmatter + HTML
- Extract headings cho TOC
- 3 file .md mẫu với đầy đủ frontmatter

### Out of Scope
- Search index (phase 05)
- UI rendering (phase 03+)

## Requirements
### Functional
- [ ] `getKnowledgeTree()` trả về đúng cấu trúc tree từ `docs/knowledge/`
- [ ] `getArticle(slug)` trả về frontmatter + rendered HTML + headings
- [ ] `getAllArticles()` trả về danh sách tất cả articles
- [ ] Frontmatter missing → fallback values hoạt động

### Non-Functional
- [ ] Parse 100 files < 500ms (build time)
- [ ] Type-safe: full TypeScript types

## Implementation Steps
1. [ ] Tạo type definitions: `KnowledgeNode`, `ArticleData`, `Heading`, `ArticleFrontmatter`
2. [ ] Implement `getKnowledgeTree()` — scan `docs/knowledge/` recursively, build tree, sort by `order`
3. [ ] Implement `getArticle(slugParts: string[])` — resolve path, read file, parse frontmatter (gray-matter), render markdown → HTML (unified pipeline), extract headings
4. [ ] Implement `getAllArticles()` — get flat list of all articles with metadata (cho search + dashboard stats)
5. [ ] Implement `getHeadings(htmlContent)` — parse h2/h3/h4 từ rendered HTML, trả về `Heading[]` với id + text + level
6. [ ] Tạo `docs/knowledge/ai/prompt-engineering.md` — bài mẫu đầy đủ (~150 dòng, có code blocks, tables, blockquotes, headings)
7. [ ] Tạo `docs/knowledge/ai/llm-basics.md` — bài mẫu trung bình (~80 dòng, status: reviewed)
8. [ ] Tạo `docs/knowledge/english/grammar-basics.md` — bài mẫu ngắn (~50 dòng, status: mastered)

## Files to Create/Modify
- `src/lib/knowledge.ts` — Core library (NEW)
- `docs/knowledge/ai/prompt-engineering.md` — Sample article (NEW)
- `docs/knowledge/ai/llm-basics.md` — Sample article (NEW)
- `docs/knowledge/english/grammar-basics.md` — Sample article (NEW)

## Acceptance Criteria
- [ ] Import `getKnowledgeTree()` trong page → trả về tree đúng cấu trúc (2 folders, 3 articles)
- [ ] Import `getArticle(['ai', 'prompt-engineering'])` → trả về đầy đủ title, tags, HTML content, headings
- [ ] File .md không có frontmatter → vẫn parse được với fallback values
- [ ] `getAllArticles()` trả về 3 articles

## Test Criteria
- [ ] Console.log `getKnowledgeTree()` trong page.tsx → output đúng
- [ ] Console.log `getArticle()` → HTML content không rỗng
- [ ] `pnpm build` thành công

## Definition of Done
- [ ] `lib/knowledge.ts` hoàn chỉnh, export 4 functions
- [ ] 3 file .md mẫu tạo xong
- [ ] Build không lỗi

## Assumptions / Notes
- Markdown pipeline: `remark-parse` → `remark-rehype` → `rehype-slug` → `rehype-highlight` → `rehype-stringify`
- Heading extraction dùng regex trên rendered HTML (đơn giản, đủ dùng)
- Reading time estimate: ~200 words/minute

---
Next Phase: Phase 03 — Shell Layout & Navigation
