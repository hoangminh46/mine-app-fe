# Phase 04: UX Polish

Status: ✅ Complete
Dependencies: None (có thể làm song song)

## Objective

Sửa 2 vấn đề UX nhỏ nhưng ảnh hưởng trải nghiệm hàng ngày: sidebar quên trạng thái expand/collapse sau mỗi lần navigate, và dashboard hiển thị sai tên folder (split slug thay vì dùng tên thật).

## Why This Phase Exists

1. **Sidebar**: Mỗi lần click article, sidebar re-render và mọi folder reset về `isExpanded = true`. User phải manually collapse lại folder không cần thiết.
2. **Dashboard**: Folder slug `"javascript-co-ban"` hiển thị thành `"Javascript Co Ban"` thay vì tên thật `"JavaScript Cơ Bản"`.

## Scope

### In Scope
- Sidebar folder expand/collapse state persist vào localStorage
- Dashboard lấy folder name từ DB thay vì split slug
- Cập nhật `ArticleListItem` type thêm `folderName`

### Out of Scope
- Sidebar remember scroll position
- Sidebar drag-and-drop reorder
- Dashboard layout changes

## Implementation Steps

1. [x] Tạo `src/lib/utils/sidebar-state.ts` — helper: `getSidebarState()`, `setSidebarExpanded(folderId, expanded)`
2. [x] Cập nhật `Sidebar.tsx` > `FolderNode` — đọc/ghi expand state từ localStorage
3. [x] Cập nhật `articles.ts` > `toArticleListItem()` — thêm `folderName` từ DB join
4. [x] Cập nhật `src/app/page.tsx` — dùng `folderName` thay vì split slug

## Files to Create/Modify

- `src/lib/utils/sidebar-state.ts` — [NEW] Sidebar state localStorage helpers
- `src/components/Sidebar.tsx` — [MODIFY] Persist expand/collapse
- `src/lib/db/queries/articles.ts` — [MODIFY] Thêm folderName vào ArticleListItem
- `src/app/page.tsx` — [MODIFY] Dùng folderName

## Acceptance Criteria

- [ ] Collapse folder A → navigate đi → quay lại → folder A vẫn collapsed
- [ ] Expand folder B → refresh page → folder B vẫn expanded
- [ ] Dashboard hiển thị đúng tên folder tiếng Việt (VD: "JavaScript Cơ Bản")
- [ ] Folder mới tạo default expanded

## Test Criteria

- [ ] Manual: Collapse 1 folder → click article → sidebar vẫn giữ state
- [ ] Manual: Refresh page → sidebar state vẫn đúng
- [ ] Manual: Tạo folder tiếng Việt → check dashboard hiển thị đúng
- [ ] Edge: localStorage bị disable → fallback về default (all expanded)

## Definition of Done

- [x] Sidebar state persistent across navigation
- [x] Dashboard folder name chính xác
- [x] localStorage error handled
- [x] Không regression các tính năng sidebar hiện có

## Notes

- localStorage key: `mine-kb-sidebar-state`
- Format: `{ [folderId]: boolean }` — true = expanded, false = collapsed
- Default cho folder mới: expanded (true)
- `folderName` lấy từ Supabase join `folders.name` — cùng query đã join `folders.slug`

---
Plan complete! 🎉
