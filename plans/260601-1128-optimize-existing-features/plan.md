# Plan: Optimize Existing Features — Performance, UX & Stability

Created: 2026-06-01T11:28
Status: ✅ Complete
Previous Plan: [Fullstack Migration](../260522-1403-fullstack-migration/plan.md)

## Overview

Tối ưu 6 vấn đề hiện có trong Mine Knowledge Base: search performance, editor auto-save, sidebar state persistence, folder name display, loading states, error boundaries. Không thêm tính năng mới.

## Goal

- App không blank screen khi DB chậm hoặc lỗi
- Search không query toàn bộ articles mỗi page load
- Editor không mất nội dung khi đóng tab / mất mạng
- Sidebar nhớ trạng thái expand/collapse
- Folder name hiển thị chính xác (không split slug)

## Scope

### In Scope
- Loading states (loading.tsx) cho các route chính
- Error boundaries (error.tsx) cho các route chính
- Search index caching (React cache)
- Editor auto-save draft (localStorage)
- Sidebar folder expand/collapse persist (localStorage)
- Dashboard folder name lấy từ DB thay vì split slug

### Out of Scope
- Bookmark / Pin articles
- Responsive polish
- Export Markdown / PDF
- Image upload
- Tag filtering
- Learning progress tracker
- Public sharing

## Actors

- **User**: Đã đăng nhập, quản lý KB cá nhân

## Core Entities

Không thay đổi entities — chỉ tối ưu cách hiển thị và xử lý data hiện có.

## Assumptions

1. Dùng `loading.tsx` + `error.tsx` của Next.js App Router (không cần thư viện mới)
2. Auto-save dùng `localStorage` (không cần thêm DB table)
3. Sidebar state persist dùng `localStorage`
4. Search cache dùng React `cache()` để deduplicate trong cùng 1 request tree

## Risks

| Risk | Mitigation |
|------|------------|
| `localStorage` không available (private browsing) | Wrap trong try/catch, fallback về default behavior |
| Auto-save conflict với DB data | Draft chỉ là fallback, luôn ưu tiên DB data khi load |
| Search cache stale sau mutation | `revalidatePath` đã được gọi sau mỗi CRUD action |

## Acceptance Criteria

- [ ] Khi DB chậm, user thấy skeleton loading thay vì blank screen
- [ ] Khi Supabase lỗi, user thấy error message thay vì crash trắng
- [ ] Search index không re-query DB khi đã có cache trong cùng request
- [ ] Editor tự lưu draft mỗi 5s vào localStorage
- [ ] Khi mở editor lại, draft được khôi phục nếu có
- [ ] Sidebar nhớ folder nào đang expand/collapse sau khi navigate
- [ ] Dashboard hiển thị đúng tên folder (không split slug)

## Phases

| Phase | Name | Tasks | Status | Depends On |
|-------|------|-------|--------|------------|
| 01 | Error Handling & Loading States | 6 | ✅ Complete | - |
| 02 | Search Performance | 3 | ✅ Complete | - |
| 03 | Editor Auto-save | 5 | ✅ Complete | - |
| 04 | UX Polish | 4 | ✅ Complete | - |

## Quick Commands

- Start current phase: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
