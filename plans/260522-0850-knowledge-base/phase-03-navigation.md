# Phase 03: Shell Layout & Navigation
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Xây dựng khung layout chính (Navbar + Sidebar + Content area) và các navigation components. Kết thúc phase này, user có thể thấy layout 3 cột với sidebar tree.

## Why This Phase Exists
Layout là "khung xương" mà tất cả content sẽ render vào. Sidebar tree là navigation chính. Cần hoàn thành trước khi bắt đầu render article content.

## Scope
### In Scope
- Navbar component (glass)
- ThemeToggle component
- Sidebar component (tree, expand/collapse, glass)
- Breadcrumb component
- Knowledge layout (3-column)

### Out of Scope
- Search modal logic (phase 05) — chỉ có nút trigger placeholder
- Article content rendering (phase 04)
- Mobile responsive final (phase 07) — chỉ làm cơ bản

## Requirements
### Functional
- [ ] Navbar sticky top với glass effect, logo, search trigger, theme toggle
- [ ] Sidebar hiển thị tree cha-con, expand/collapse
- [ ] Active article highlight trong sidebar
- [ ] Theme toggle dark ↔ light, persist localStorage
- [ ] Breadcrumb hiển thị đúng path
- [ ] Layout 3 cột: Sidebar (280px) | Content (flex) | TOC placeholder (220px)

### Non-Functional
- [ ] Sidebar expand/collapse animation smooth (200ms)
- [ ] Theme transition smooth (300ms)
- [ ] Glass effect rõ ràng trên cả dark và light mode

## Implementation Steps
1. [ ] Tạo `ThemeToggle.tsx` — sun/moon icon, toggle class `dark`/`light` trên `<html>`, persist `localStorage`
2. [ ] Tạo `Navbar.tsx` — glass navbar sticky, logo "Mine KB", search trigger button (placeholder), theme toggle, glass styling
3. [ ] Tạo `Sidebar.tsx` — nhận `KnowledgeNode[]` tree data, render recursive tree, folder expand/collapse với chevron icon
4. [ ] Thêm glass styling cho Sidebar — glass panel, hover effects, active item glow
5. [ ] Thêm status indicators cho Sidebar items — 🔵 learning, 🟡 reviewed, 🟢 mastered (color dots)
6. [ ] Tạo `Breadcrumb.tsx` — nhận slug array, render path `Home > Folder > Article`, clickable links
7. [ ] Tạo `src/app/knowledge/layout.tsx` — 3-column layout, import Sidebar, fetch tree data, truyền vào Sidebar
8. [ ] Wire up Navbar vào root `layout.tsx` — hiện trên mọi trang
9. [ ] Tạo placeholder content area trong knowledge layout — "Select an article" message
10. [ ] Test navigation flow: click sidebar items → URL thay đổi, active state update

## Files to Create/Modify
- `src/components/ThemeToggle.tsx` — Dark/Light toggle (NEW)
- `src/components/Navbar.tsx` — Glass navbar (NEW)
- `src/components/Sidebar.tsx` — Tree sidebar (NEW)
- `src/components/Breadcrumb.tsx` — Path breadcrumb (NEW)
- `src/app/knowledge/layout.tsx` — 3-column knowledge layout (NEW)
- `src/app/layout.tsx` — Add Navbar (MODIFY)

## Acceptance Criteria
- [ ] Vào `/knowledge` → thấy layout 3 cột: sidebar | content | TOC placeholder
- [ ] Sidebar hiển thị tree: AI (expand → Prompt Engineering, LLM Basics), English (expand → Grammar)
- [ ] Click folder → expand/collapse smooth
- [ ] Click article trong sidebar → URL change, item highlighted
- [ ] Theme toggle → dark ↔ light, reload → vẫn giữ theme
- [ ] Navbar glass effect nhìn xuyên thấy gradient background khi scroll

## Test Criteria
- [ ] Navigate qua lại giữa các articles → sidebar state đúng
- [ ] Toggle theme 5 lần → không flicker, persist
- [ ] Breadcrumb hiển thị đúng path cho mỗi route

## Definition of Done
- [ ] 4 components tạo xong
- [ ] Knowledge layout hoàn chỉnh
- [ ] Navigation flow hoạt động
- [ ] Glass effect visible

## Assumptions / Notes
- Sidebar data lấy từ `getKnowledgeTree()` (phase 02) — nếu phase 02 chưa xong, dùng mock data
- Search trigger button chỉ là placeholder — logic search ở phase 05
- TOC cột phải chỉ là placeholder div — component TOC ở phase 05
- Mobile sidebar sẽ refine ở phase 07

---
Next Phase: Phase 04 — Article Rendering
