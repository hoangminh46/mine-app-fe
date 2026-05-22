# Phase 06: Table of Contents
Status: ✅ Complete
Dependencies: Phase 04

## Objective
Thêm Table of Contents bên phải article page với scroll spy — highlight heading đang đọc khi scroll.

## Why This Phase Exists
TOC giúp navigate nhanh trong bài viết dài. Scroll spy giúp user biết đang đọc section nào. Đây là killer feature cho long-form reading.

## Scope
### In Scope
- TOC component (render heading tree)
- Scroll spy (IntersectionObserver)
- Smooth scroll on click
- Glass panel styling, sticky position
- Wire vào knowledge layout cột phải

### Out of Scope
- Mobile TOC toggle (phase 09)
- TOC collapse/expand (v2)

## Requirements
### Functional
- [ ] TOC hiển thị h2/h3/h4 từ article content dạng nested list
- [ ] Heading đang đọc (visible in viewport) được highlight
- [ ] Click TOC item → smooth scroll tới heading đó
- [ ] TOC ẩn khi bài < 3 headings
- [ ] TOC sticky bên phải, không chạy khi scroll

### Non-Functional
- [ ] Scroll spy dùng `IntersectionObserver` (performant, no scroll listener)
- [ ] Smooth scroll: `scrollIntoView({ behavior: 'smooth', block: 'start' })`
- [ ] Glass panel subtle, không chiếm quá nhiều attention

## Implementation Steps
1. [ ] Tạo `TableOfContents.tsx` — client component, nhận `Heading[]` (id, text, level), render nested list (h2 → indent 0, h3 → indent 1, h4 → indent 2)
2. [ ] Implement scroll spy — setup `IntersectionObserver` trên tất cả heading elements (query `[id]` trong article), track heading nào đang visible, update active state
3. [ ] Thêm smooth scroll on click — mỗi TOC item click → `document.getElementById(id).scrollIntoView({ behavior: 'smooth' })`, offset cho navbar height
4. [ ] Style TOC — glass panel (`.glass-panel`), sticky `position: sticky; top: 100px`, compact font size, active item có accent color + left border, hover effect
5. [ ] Wire vào knowledge layout — truyền headings data từ article page, render TOC ở cột phải, conditional render (ẩn khi headings.length < 3)

## Files to Create/Modify
- `src/components/TableOfContents.tsx` — TOC with scroll spy (NEW)
- `src/app/knowledge/layout.tsx` — Add TOC slot in right column (MODIFY)
- `src/app/knowledge/[[...slug]]/page.tsx` — Pass headings data (MODIFY)

## Acceptance Criteria
- [ ] Mở article có 5+ headings → TOC hiển thị bên phải
- [ ] Scroll xuống → heading đang đọc highlight trong TOC
- [ ] Click TOC item → smooth scroll tới heading, offset đúng (không bị che bởi navbar)
- [ ] Bài có 2 headings → TOC không hiển thị
- [ ] TOC sticky khi scroll, không bị trôi

## Test Criteria
- [ ] Bài có 10+ headings (h2, h3, h4 mixed) → TOC render đúng hierarchy
- [ ] Scroll nhanh → spy update kịp, không lag
- [ ] Resize browser nhỏ → TOC vẫn hoạt động (sẽ ẩn trên mobile ở phase 09)

## Definition of Done
- [ ] TOC component hoàn chỉnh
- [ ] Scroll spy chính xác
- [ ] Wired vào layout
- [ ] Glass styling đẹp

## Assumptions / Notes
- IntersectionObserver options: `rootMargin: '-80px 0px -60% 0px'` (heading phải vào top 40% viewport mới active)
- Heading IDs đã được tạo bởi `rehype-slug` (phase 02)
- TOC width: 220px trên desktop

---
Next Phase: Phase 07 — Search Modal
