# Phase 04: Data Layer Migration

Status: ⬜ Pending  
Dependencies: Phase 03

## Objective

Thay thế data layer hiện tại (filesystem → `knowledge.ts`) bằng DB queries. Sidebar, breadcrumb, và trang knowledge đọc từ Supabase thay vì static files.

## Implementation Steps

1. [ ] Tạo `src/lib/db/queries/folders.ts` — getFolderTree(), getFolderBySlug()
2. [ ] Tạo `src/lib/db/queries/articles.ts` — getArticleBySlug(), getArticlesByFolder(), getAllUserArticles()
3. [ ] Tạo `src/lib/markdown.ts` — tách markdown processing pipeline (renderMarkdown, getHeadings, calculateReadingTime, generateExcerpt) ra khỏi knowledge.ts, dùng lại cho DB content
4. [ ] Update `src/app/knowledge/layout.tsx` — fetch folder tree từ DB thay vì getKnowledgeTree()
5. [ ] Update `src/app/knowledge/[[...slug]]/page.tsx` — đọc article/folder từ DB
6. [ ] Update `Sidebar.tsx` — nhận data từ DB query thay vì static tree
7. [ ] Update `Breadcrumb.tsx` — dùng folder names từ DB
8. [ ] Xóa `src/lib/knowledge.ts` và `docs/knowledge/` — remove static data layer hoàn toàn

## Files to Create/Modify

- `src/lib/db/queries/folders.ts` — [NEW] Folder queries
- `src/lib/db/queries/articles.ts` — [NEW] Article queries
- `src/lib/markdown.ts` — [NEW] Markdown utilities (extracted)
- `src/app/knowledge/layout.tsx` — [MODIFY] DB-based sidebar data
- `src/app/knowledge/[[...slug]]/page.tsx` — [MODIFY] DB-based article/folder
- `src/components/Sidebar.tsx` — [MODIFY] Accept DB data format
- `src/components/Breadcrumb.tsx` — [MODIFY] DB-based breadcrumb
- `src/lib/knowledge.ts` — [DELETE]
- `docs/knowledge/` — [DELETE] Static files

## Acceptance Criteria

- [ ] Sidebar hiển thị folders/articles từ DB
- [ ] Article reading view render đúng từ DB content
- [ ] Breadcrumb hiển thị đúng hierarchy
- [ ] TOC, code blocks, progress bar hoạt động bình thường
- [ ] `docs/knowledge/` đã xóa
- [ ] `knowledge.ts` đã xóa
- [ ] Không còn filesystem reads

## Definition of Done

- [ ] All reading flows working từ DB
- [ ] No filesystem dependencies
- [ ] `npm run build` thành công

---
Next Phase: phase-05-folder-crud.md
