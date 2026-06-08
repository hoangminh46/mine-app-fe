# Spec: Optimize Existing Features

Created: 2026-06-01
Plan: [plans/260601-1128-optimize-existing-features](../../plans/260601-1128-optimize-existing-features/plan.md)

## 1. Executive Summary

Tối ưu 6 vấn đề hiện có trong Mine Knowledge Base để cải thiện performance, UX, và độ ổn định. Không thêm tính năng mới, chỉ nâng chất lượng code và trải nghiệm cho các chức năng đã có.

## 2. Goal and Non-Goals

### Goals
- Không blank screen khi DB chậm/lỗi → loading + error states
- Search không query full content mỗi page load → lightweight query + cache
- Editor không mất nội dung khi đóng tab → auto-save localStorage
- Sidebar nhớ trạng thái → localStorage persist
- Folder name hiển thị chính xác → lấy từ DB

### Non-Goals
- Không thêm feature mới (bookmark, export, image upload...)
- Không thay đổi DB schema
- Không thay đổi auth flow
- Không thay đổi deployment strategy

## 3. Actors / Roles

- **User**: Người dùng đã đăng nhập, thao tác CRUD hàng ngày

## 4. User Stories

- Là user, tôi muốn thấy skeleton loading khi page đang tải, để biết app đang hoạt động
- Là user, tôi muốn thấy error message khi DB lỗi, để biết vấn đề và có thể retry
- Là user, tôi muốn editor tự lưu draft, để không mất nội dung khi đóng tab
- Là user, tôi muốn sidebar nhớ folder nào tôi đã collapse, để không phải thu gọn lại mỗi lần
- Là user, tôi muốn thấy đúng tên folder trên dashboard, không phải slug bị biến đổi

## 5. Domain Entities

Không thay đổi. Entities hiện có: `profiles`, `folders`, `articles`.

## 6. Core Flows

### Flow 1: Loading State
```
User navigate → Server component bắt đầu fetch → loading.tsx hiển thị skeleton → Data loaded → Real content render
```

### Flow 2: Error Recovery
```
User navigate → Server component fetch lỗi → error.tsx hiển thị → User bấm "Thử lại" → Page re-fetch
```

### Flow 3: Auto-save Draft
```
User mở editor → Bắt đầu viết → Mỗi 5s auto-save vào localStorage → User đóng tab → Mở lại editor → Thấy recovery dialog → Chọn khôi phục hoặc bỏ → Tiếp tục viết → Save thành công → Draft xóa
```

### Flow 4: Sidebar State
```
User collapse folder → State lưu localStorage → Navigate đi → Quay lại → Folder vẫn collapsed
```

## 7. Edge Cases

| Case | Handling |
|------|----------|
| localStorage disabled (private browsing) | try/catch, fallback về default behavior |
| Draft cũ hơn DB data | So sánh timestamp, ưu tiên hỏi user |
| Supabase timeout giữa chừng | Error boundary catch, hiển thị retry |
| Multiple tabs cùng edit 1 article | Mỗi tab giữ draft riêng (by articleId) |
| Folder bị xóa nhưng sidebar state vẫn còn | Tự cleanup — key không match thì bỏ qua |

## 8. Technical Design

### Loading States
- Dùng Next.js App Router `loading.tsx` convention
- Skeleton UI bằng CSS animation (`@keyframes shimmer`)
- Khớp layout với trang thật để tránh layout shift

### Error Boundaries
- Dùng Next.js `error.tsx` convention (`"use client"`)
- Props: `error`, `reset` từ Next.js
- UI: Icon lỗi + message + nút "Thử lại" (gọi `reset()`)

### Search Cache
- React `cache()` wrap query function
- Chỉ deduplicate trong cùng 1 server request
- Tạo `getSearchableArticles()` — select title, slug, tags, folder_id only (no content)

### Auto-save
- `localStorage` key: `mine-kb-draft-{articleId}` hoặc `mine-kb-draft-new`
- Debounced 5 giây
- Data: `{ title, content, folderId, status, difficulty, tagsInput, savedAt }`
- Recovery: So sánh `savedAt` với article `updatedAt`

### Sidebar State
- `localStorage` key: `mine-kb-sidebar-state`
- Format: `{ [folderId]: boolean }`
- Default: expanded (true)

## 9. Acceptance Criteria

1. Khi DB chậm → skeleton loading hiển thị
2. Khi Supabase lỗi → error boundary hiển thị + retry
3. Search không query full content
4. Editor auto-save draft mỗi 5s
5. Draft recovery khi mở lại editor
6. Sidebar persist expand/collapse
7. Dashboard hiển thị đúng folder name

## 10. Build Checklist

- [ ] Phase 01: Error Handling & Loading States (6 files)
- [ ] Phase 02: Search Performance (2 files modify)
- [ ] Phase 03: Editor Auto-save (1 new + 1 modify)
- [ ] Phase 04: UX Polish (1 new + 3 modify)
