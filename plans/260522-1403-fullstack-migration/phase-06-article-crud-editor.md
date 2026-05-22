# Phase 06: Article CRUD + Markdown Editor

Status: ⬜ Pending  
Dependencies: Phase 05

## Objective

User có thể tạo, sửa, và xóa articles. Trang editor split-pane: Markdown bên trái, live preview bên phải.

## Implementation Steps

1. [ ] Cài `@uiw/react-md-editor` dependency
2. [ ] Tạo server actions: `src/lib/actions/articles.ts` — createArticle, updateArticle, deleteArticle
3. [ ] Tạo slug utility: `src/lib/utils/slug.ts` — generateSlug() từ title (Vietnamese-friendly)
4. [ ] Tạo article editor page: `src/app/knowledge/editor/[[...slug]]/page.tsx`
   - Mode: new (no slug) hoặc edit (có slug → load content)
   - Form fields: title, folder select, status, difficulty, tags
   - Split-pane: @uiw/react-md-editor (editor) + live preview
   - Save button → server action → redirect reading view
5. [ ] Tạo `ArticleEditor` component — wrapper cho @uiw/react-md-editor + metadata form
6. [ ] Tạo `ArticleMetadataForm` component — status, difficulty, tags dropdowns
7. [ ] Thêm "New Article" button vào Sidebar + FolderListing
8. [ ] Thêm "Edit" + "Delete" buttons vào article reading view
9. [ ] Delete confirmation dialog: "Bạn có chắc muốn xóa [title]?"
10. [ ] Verify: Full CRUD flow — create → edit → read → delete

## Files to Create/Modify

- `src/lib/actions/articles.ts` — [NEW] Article server actions
- `src/lib/utils/slug.ts` — [NEW] Slug generator
- `src/app/knowledge/editor/[[...slug]]/page.tsx` — [NEW] Editor page
- `src/components/ArticleEditor.tsx` — [NEW] Markdown editor wrapper
- `src/components/ArticleMetadataForm.tsx` — [NEW] Metadata form
- `src/components/Sidebar.tsx` — [MODIFY] Add "New Article" button
- `src/components/FolderListing.tsx` — [MODIFY] Add "New Article" button
- `src/app/knowledge/[[...slug]]/page.tsx` — [MODIFY] Add Edit/Delete buttons
- `src/app/globals.css` — [MODIFY] Editor page styles

## Acceptance Criteria

- [ ] Tạo article: nhập title → slug auto-generate → editor mở
- [ ] Editor: split-pane (markdown left, preview right)
- [ ] Preview render giống reading view (cùng CSS)
- [ ] Save: article lưu DB, redirect reading view
- [ ] Edit: mở editor với content hiện tại, save cập nhật DB
- [ ] Delete: confirm → xóa DB → redirect folder
- [ ] Metadata form: status, difficulty, tags hoạt động
- [ ] Slug xử lý tiếng Việt đúng (dấu → không dấu)

## Definition of Done

- [ ] Full CRUD working
- [ ] Editor UX smooth
- [ ] `npm run build` thành công

---
Next Phase: phase-07-dashboard-search-onboarding.md
