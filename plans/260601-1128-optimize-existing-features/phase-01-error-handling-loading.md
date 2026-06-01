# Phase 01: Error Handling & Loading States

Status: ✅ Complete
Dependencies: None

## Objective

Đảm bảo app không blank screen khi DB chậm (sau Supabase wake up) và không crash trắng khi có lỗi. Thêm loading skeletons + error boundaries cho tất cả route chính.

## Why This Phase Exists

Hiện tại mọi page đều là Server Component chờ DB xong mới render. Khi Supabase mới restore từ pause, response có thể mất 5-10s → user thấy trắng xóa. Nếu DB lỗi hoặc timeout, cả app crash không có fallback.

## Scope

### In Scope
- `loading.tsx` cho: Dashboard (`/`), Knowledge (`/knowledge`), Editor (`/knowledge/editor`)
- `error.tsx` cho: Dashboard (`/`), Knowledge (`/knowledge`), Editor (`/knowledge/editor`)
- Skeleton UI components phù hợp với layout hiện tại

### Out of Scope
- Global error page (đã có `not-found.tsx` mặc định của Next.js)
- Login page loading (không cần vì không query DB)

## Implementation Steps

1. [x] Tạo `src/app/loading.tsx` — Dashboard skeleton (stats cards + recent articles)
2. [x] Tạo `src/app/error.tsx` — Dashboard error boundary với retry button
3. [x] Tạo `src/app/knowledge/loading.tsx` — Knowledge page skeleton (sidebar + content)
4. [x] Tạo `src/app/knowledge/error.tsx` — Knowledge error boundary
5. [x] Tạo `src/app/knowledge/editor/loading.tsx` — Editor skeleton (title + editor area)
6. [x] Tạo `src/app/knowledge/editor/error.tsx` — Editor error boundary

## Files to Create

- `src/app/loading.tsx` — Dashboard loading skeleton
- `src/app/error.tsx` — Dashboard error boundary
- `src/app/knowledge/loading.tsx` — Knowledge loading skeleton
- `src/app/knowledge/error.tsx` — Knowledge error boundary
- `src/app/knowledge/editor/loading.tsx` — Editor loading skeleton
- `src/app/knowledge/editor/error.tsx` — Editor error boundary

## Acceptance Criteria

- [ ] Khi DB response chậm (>1s), user thấy skeleton animation thay vì blank
- [ ] Khi Supabase trả lỗi, user thấy error message + nút "Thử lại"
- [ ] Error boundary không leak stack trace cho user
- [ ] Skeleton layout khớp với layout thật (không bị layout shift)

## Test Criteria

- [ ] Manual: Throttle network trong DevTools → thấy skeleton
- [ ] Manual: Block Supabase domain → thấy error boundary
- [ ] Visual: Skeleton → real content transition mượt, không giật

## Definition of Done

- [x] 6 files loading/error đã tạo
- [x] Skeleton UI khớp layout
- [x] Error có retry button
- [x] Không có layout shift

## Notes

- `error.tsx` phải là `"use client"` component (Next.js requirement)
- `loading.tsx` là server component, dùng CSS animation cho skeleton
- Skeleton nên dùng CSS custom properties đã có (`--glass-bg`, `--border-subtle`)

---
Next Phase: Phase 02 — Search Performance
