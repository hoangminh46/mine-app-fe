# Phase 05: Folder CRUD

Status: ⬜ Pending  
Dependencies: Phase 04

## Objective

User có thể tạo, đổi tên, và xóa folders từ UI. Sidebar phản ánh thay đổi ngay lập tức.

## Implementation Steps

1. [ ] Tạo server actions: `src/lib/actions/folders.ts` — createFolder, renameFolder, deleteFolder
2. [ ] Tạo `CreateFolderDialog` component — modal form: tên folder, chọn parent (optional)
3. [ ] Thêm "+" button vào Sidebar header → mở CreateFolderDialog
4. [ ] Thêm folder context menu: Rename / Delete (icon buttons hoặc dropdown)
5. [ ] Delete confirmation: hiện warning "Folder này có X articles, xóa hết?" nếu có articles
6. [ ] Verify: Create → hiện trong sidebar, Rename → sidebar update, Delete → sidebar remove

## Files to Create/Modify

- `src/lib/actions/folders.ts` — [NEW] Folder server actions
- `src/components/CreateFolderDialog.tsx` — [NEW] Create folder modal
- `src/components/Sidebar.tsx` — [MODIFY] Add folder action buttons
- `src/app/knowledge/layout.tsx` — [MODIFY] Revalidate after folder mutation

## Acceptance Criteria

- [ ] Tạo folder → hiện trong sidebar đúng vị trí
- [ ] Rename folder → sidebar cập nhật tên mới, URL slug cập nhật
- [ ] Delete empty folder → sidebar remove folder
- [ ] Delete folder có articles → confirm dialog → xóa folder + articles
- [ ] Validation: tên trống, tên trùng → error message

## Definition of Done

- [ ] CRUD hoạt động end-to-end
- [ ] Sidebar reactive sau mỗi thao tác
- [ ] Error states handled

---
Next Phase: phase-06-article-crud-editor.md
