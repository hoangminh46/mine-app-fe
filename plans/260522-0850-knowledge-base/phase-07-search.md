# Phase 07: Search Modal
Status: ✅ Complete
Dependencies: Phase 02

## Objective
Xây dựng full-text search modal (Ctrl+K) với fuzzy search, keyboard navigation, và glass UI.

## Why This Phase Exists
Search là cách nhanh nhất để tìm bài viết khi knowledge base lớn lên. Ctrl+K là UX pattern quen thuộc (VS Code, GitHub, Notion) mà developer yêu thích.

## Scope
### In Scope
- Search index builder (build time)
- SearchModal component (glass overlay)
- Ctrl+K / ⌘K keyboard shortcut
- Fuse.js fuzzy search
- Keyboard navigation (↑↓ Enter Esc)
- Wire vào Navbar

### Out of Scope
- Search by tag filter (v2)
- Search history / recent searches (v2)
- Search analytics (v2)

## Requirements
### Functional
- [ ] `Ctrl+K` (hoặc `⌘K` Mac) → search modal mở
- [ ] Gõ keyword → results hiện realtime (debounce 200ms)
- [ ] Results hiển thị: title, folder/category, matched snippet
- [ ] ↑↓ keys → move selection highlight
- [ ] Enter → navigate tới selected article, modal đóng
- [ ] Esc hoặc click backdrop → modal đóng
- [ ] Search input auto-focus khi modal mở

### Non-Functional
- [ ] Search index load lazy (không block initial page load)
- [ ] Debounce search: 200ms
- [ ] Modal backdrop: blur effect (glass)
- [ ] Max 10 results displayed

## Implementation Steps
1. [ ] Tạo `src/lib/search.ts` — function `buildSearchIndex()`: gọi `getAllArticles()`, extract title + tags + excerpt (first 200 chars stripped HTML) → export JSON array
2. [ ] Tạo `SearchModal.tsx` — client component, glass modal overlay (centered), search input top, results list below, empty state "Không tìm thấy"
3. [ ] Wire `Ctrl+K` shortcut — global `useEffect` + `keydown` listener, check `(e.ctrlKey || e.metaKey) && e.key === 'k'`, `preventDefault()`, toggle modal
4. [ ] Implement search logic — load search index (import JSON), init `Fuse.js` instance, search on input change with `setTimeout` debounce 200ms, update results state
5. [ ] Thêm keyboard navigation — track `selectedIndex` state, `ArrowUp`/`ArrowDown` change index (wrap around), `Enter` navigate (`router.push`), `Esc` close modal
6. [ ] Wire search trigger trong Navbar — click search button → open modal, thêm SearchModal vào root layout hoặc knowledge layout

## Files to Create/Modify
- `src/lib/search.ts` — Search index builder (NEW)
- `src/components/SearchModal.tsx` — Search modal UI (NEW)
- `src/components/Navbar.tsx` — Wire search button to open modal (MODIFY)
- `src/app/layout.tsx` — Add SearchModal (MODIFY)

## Acceptance Criteria
- [ ] `Ctrl+K` → modal mở, input focused
- [ ] Gõ "prompt" → "Prompt Engineering" hiện trong results
- [ ] ↑↓ → selection di chuyển, Enter → navigate tới bài
- [ ] Esc → modal đóng
- [ ] Click backdrop → modal đóng
- [ ] Gõ "xyzabc" (không match) → "Không tìm thấy kết quả"

## Test Criteria
- [ ] Search empty string → hiển thị tất cả articles (hoặc placeholder)
- [ ] Search partial match ("pro") → fuzzy match "Prompt Engineering"
- [ ] Keyboard nav wrap: ở item cuối, nhấn ↓ → quay lại đầu
- [ ] Mở modal, navigate away → modal đóng clean

## Definition of Done
- [ ] Search index builder hoàn chỉnh
- [ ] SearchModal component hoàn chỉnh
- [ ] Keyboard shortcuts + navigation hoạt động
- [ ] Wired vào Navbar + layout

## Assumptions / Notes
- Fuse.js options: `{ keys: ['title', 'tags', 'excerpt'], threshold: 0.4, includeMatches: true, limit: 10 }`
- Search index là array nhỏ (< 500 items), load toàn bộ vào memory OK
- Modal dùng `createPortal` hoặc render ở root level để z-index đúng
- `router.push()` dùng Next.js `useRouter` hook

---
Next Phase: Phase 08 — Dashboard & Folder Pages
