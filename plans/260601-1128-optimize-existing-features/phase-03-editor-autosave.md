# Phase 03: Editor Auto-save

Status: ✅ Complete
Dependencies: None (có thể làm song song)

## Objective

Tự động lưu draft bài viết vào localStorage khi đang chỉnh sửa, để không mất nội dung nếu đóng tab, mất mạng, hoặc browser crash. Khôi phục draft khi mở lại editor.

## Why This Phase Exists

Hiện tại ArticleEditor chỉ lưu khi user bấm nút "Lưu". Nếu đóng tab hoặc mất mạng giữa chừng, toàn bộ nội dung đang viết sẽ mất. Đây là pain point lớn với bất kỳ editor nào.

## Scope

### In Scope
- Auto-save draft vào localStorage mỗi 5 giây (debounced)
- Hiển thị indicator "Draft saved" khi auto-save
- Khôi phục draft khi mở editor (nếu draft mới hơn DB data)
- Dialog xác nhận khi có draft: "Khôi phục bản nháp?" với option Khôi phục / Bỏ qua
- Xóa draft sau khi save thành công vào DB

### Out of Scope
- Sync draft qua devices (cần DB table riêng)
- Version history / undo beyond browser session
- Conflict resolution phức tạp

## Implementation Steps

1. [x] Tạo `src/lib/utils/draft.ts` — helper functions: `saveDraft()`, `loadDraft()`, `clearDraft()`, `hasDraft()`
2. [x] Tạo custom hook `useDraftAutoSave()` — debounced auto-save mỗi 5s
3. [x] Cập nhật `ArticleEditor.tsx` — integrate auto-save hook
4. [x] Thêm draft recovery UI — banner/dialog khi phát hiện draft cũ
5. [x] Thêm "Draft saved" indicator trong editor header

## Files to Create/Modify

- `src/lib/utils/draft.ts` — [NEW] Draft localStorage helpers
- `src/components/ArticleEditor.tsx` — [MODIFY] Integrate auto-save + recovery

## Acceptance Criteria

- [ ] Khi đang viết, draft tự lưu mỗi 5s (không cần bấm gì)
- [ ] Khi đóng tab rồi mở lại editor, thấy dialog khôi phục draft
- [ ] Khi chọn "Khôi phục", nội dung draft được load lại
- [ ] Khi chọn "Bỏ qua", draft bị xóa, load data từ DB
- [ ] Sau khi save thành công vào DB, draft tự xóa
- [ ] Nếu localStorage không available (private browsing), app vẫn hoạt động bình thường

## Test Criteria

- [ ] Manual: Viết nội dung → đóng tab → mở lại → thấy draft recovery
- [ ] Manual: Save thành công → mở lại → không thấy draft cũ
- [ ] Manual: Create mode + Edit mode đều hoạt động
- [ ] Edge: localStorage bị disable → không crash, chỉ skip auto-save

## Definition of Done

- [x] Auto-save hoạt động cho cả create và edit mode
- [x] Draft recovery UI rõ ràng
- [x] Draft cleanup sau save thành công
- [x] localStorage error handled gracefully

## Notes

- Draft key format: `mine-kb-draft-{articleId}` (edit) hoặc `mine-kb-draft-new` (create)
- Chỉ lưu: title, content, folderId, status, difficulty, tagsInput
- Draft có timestamp để so sánh với DB data
- Dùng `JSON.stringify/parse` với try/catch

---
Next Phase: Phase 04 — UX Polish
