# Phase 08: Dashboard & Folder Pages
Status: ✅ Complete
Dependencies: Phase 02, Phase 04

## Objective
Xây dựng trang chủ Dashboard (thống kê + recent articles) và trang Folder Listing (danh sách bài trong 1 chủ đề).

## Why This Phase Exists
Dashboard là landing page, tạo ấn tượng đầu tiên và tổng quan tiến độ học. Folder listing giúp browse bài viết theo chủ đề khi click vào folder trên sidebar.

## Scope
### In Scope
- Dashboard: hero section, stats cards (glass), recent articles
- Folder listing: grid cards khi navigate vào folder
- Empty states

### Out of Scope
- Filtering by tags (v2)
- Sorting options (v2)
- Search on dashboard (đã có global search phase 07)

## Requirements
### Functional
- [ ] Dashboard hiển thị: total articles, learning count, reviewed count, mastered count
- [ ] Dashboard hiển thị recent articles (mới updated nhất, tối đa 5)
- [ ] Click article item → navigate tới article page
- [ ] Folder listing hiển thị tất cả articles trong folder dạng grid cards
- [ ] Card hiển thị: title, tags, difficulty, status, excerpt (~100 chars)
- [ ] Click card → navigate tới article

### Non-Functional
- [ ] Stats cards dùng glass effect
- [ ] Article cards dùng glass effect + hover glow
- [ ] Empty state khi folder rỗng: icon + "Chưa có bài viết nào"

## Implementation Steps
1. [ ] Update `src/app/page.tsx` — dashboard layout, fetch stats từ `getAllArticles()` at build time
2. [ ] Tạo hero section — "Mine Knowledge Base" gradient text title, subtitle, search shortcut hint
3. [ ] Tạo stats cards — 4 glass cards (Total, Learning, Reviewed, Mastered) với count number + emoji icon, hover glow
4. [ ] Tạo recent articles section — list 5 bài mới updated, mỗi item: title + folder + date + status badge, clickable
5. [ ] Style dashboard — glass cards grid, gradient accents, hover effects, spacing
6. [ ] Tạo `FolderListing.tsx` — nhận list articles, render responsive grid, mỗi card: title + tags + difficulty + status + excerpt
7. [ ] Handle folder route trong `[[...slug]]/page.tsx` — detect slug là folder hay article, nếu folder → render FolderListing, nếu article → render article
8. [ ] Thêm empty state — khi folder rỗng: centered icon + message

## Files to Create/Modify
- `src/app/page.tsx` — Dashboard page (REWRITE)
- `src/components/FolderListing.tsx` — Folder index cards (NEW)
- `src/app/knowledge/[[...slug]]/page.tsx` — Add folder detection (MODIFY)

## Acceptance Criteria
- [ ] Vào `/` → Dashboard hiển thị 4 stats cards với số đúng (3 total, phân bổ status)
- [ ] Recent articles hiển thị, click → navigate tới article
- [ ] Vào `/knowledge/ai` → Grid cards hiển thị 2 articles (Prompt Engineering, LLM Basics)
- [ ] Hover card → glass glow effect
- [ ] Folder rỗng → empty state message
- [ ] Dashboard hero section đẹp, gradient text

## Test Criteria
- [ ] Stats count chính xác theo số file .md và status
- [ ] Folder listing sort theo `order` field
- [ ] Click card → navigate đúng route

## Definition of Done
- [ ] Dashboard hoàn chỉnh
- [ ] FolderListing component xong
- [ ] Folder detection logic hoạt động
- [ ] Build thành công

## Assumptions / Notes
- Stats count từ `getAllArticles()` tại build time
- Recent articles sort by `updated` date descending
- Excerpt: strip HTML tags từ content, cắt 100 chars đầu + "..."
- Dashboard và FolderListing là Server Components

---
Next Phase: Phase 09 — Responsive, Polish & Verification
