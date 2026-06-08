# Phase 02: Search Performance

Status: ✅ Complete
Dependencies: None (có thể làm song song với Phase 01)

## Objective

Tối ưu search index để không query toàn bộ articles + render markdown excerpt cho mỗi page load. Dùng React `cache()` để deduplicate query trong cùng 1 request tree.

## Why This Phase Exists

Hiện tại `buildSearchIndex()` được gọi trong `layout.tsx` → chạy lại mỗi lần navigate. Hàm này gọi `getAllUserArticles()` → query DB + `calculateReadingTime()` + `generateExcerpt()` cho **mọi** bài viết. Khi có 100+ bài, đây là bottleneck nghiêm trọng.

## Scope

### In Scope
- Cache `getAllUserArticles()` với React `cache()` để deduplicate trong cùng request
- Tối ưu `buildSearchIndex()` — chỉ lấy fields cần thiết cho search
- Tạo query riêng cho search (chỉ select title, slug, tags, excerpt — không lấy full content)

### Out of Scope
- Server-side search (vẫn dùng Fuse.js client-side)
- Search indexing service
- Pagination cho articles

## Implementation Steps

1. [x] Tạo `getSearchableArticles()` trong `articles.ts` — chỉ select fields cần cho search, không lấy full content
2. [x] Cập nhật `buildSearchIndex()` dùng `getSearchableArticles()` thay vì `getAllUserArticles()`
3. [x] Wrap `getSearchableArticles()` với React `cache()` để deduplicate trong cùng request tree

## Files to Modify

- `src/lib/db/queries/articles.ts` — Thêm `getSearchableArticles()` (lightweight query)
- `src/lib/search.ts` — Dùng query mới

## Acceptance Criteria

- [ ] Search index build không query full content từ DB
- [ ] Nếu `getAllUserArticles()` và `getSearchableArticles()` cùng được gọi trong 1 request, DB chỉ bị query 1 lần cho mỗi hàm
- [ ] Search vẫn hoạt động đúng (fuzzy search by title, tags, excerpt)
- [ ] Dashboard vẫn hiển thị đúng (dùng `getAllUserArticles()` riêng)

## Test Criteria

- [ ] Manual: Search hoạt động bình thường sau thay đổi
- [ ] Manual: Check Network tab — không có duplicate Supabase queries
- [ ] Manual: Tạo article mới → search thấy ngay (revalidate hoạt động)

## Definition of Done

- [x] Query riêng cho search (không lấy full content)
- [x] React `cache()` applied
- [x] Search vẫn chính xác
- [x] Dashboard không bị ảnh hưởng

## Notes

- React `cache()` chỉ deduplicate trong cùng 1 server request (không phải cross-request cache)
- `revalidatePath("/", "layout")` đã được gọi sau mỗi CRUD → cache tự invalidate
- Không dùng `unstable_cache` vì API có thể thay đổi ở Next.js versions sau

---
Next Phase: Phase 03 — Editor Auto-save
