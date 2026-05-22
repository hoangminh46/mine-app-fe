# Phase 01: Foundation — Dependencies & Design System
Status: ✅ Complete
Dependencies: None

## Objective
Cài đặt dependencies và xây dựng Liquid Glass design system (CSS) làm nền tảng cho toàn bộ dự án.

## Why This Phase Exists
Mọi component và page đều phụ thuộc vào design tokens và glass utilities. Làm foundation trước giúp các phase sau chỉ cần tập trung vào logic, không phải lo styling cơ bản.

## Scope
### In Scope
- Cài npm dependencies
- CSS variables (dark/light color tokens)
- Glass utility classes
- Gradient mesh background
- Typography scale
- Root layout update (font, metadata, dark mode)

### Out of Scope
- Components UI (phase 03+)
- Markdown processing (phase 02)
- Routing (phase 03+)

## Requirements
### Functional
- [ ] Trang web load được với font Inter, dark mode mặc định
- [ ] Background hiển thị gradient mesh animation nhẹ
- [ ] CSS variables đầy đủ cho dark/light mode

### Non-Functional
- [ ] `backdrop-filter` chỉ define class, chưa apply
- [ ] `prefers-reduced-motion` được handle
- [ ] Page load < 2s trên localhost

## Implementation Steps
1. [ ] Cài dependencies: `gray-matter`, `unified`, `remark-parse`, `remark-rehype`, `rehype-stringify`, `rehype-slug`, `rehype-highlight`, `highlight.js`, `fuse.js`
2. [ ] Update `next.config.ts` — thêm config nếu cần
3. [ ] Tạo CSS variables block: dark mode tokens (bg, glass, text, accent, status colors)
4. [ ] Tạo CSS variables block: light mode tokens (`.light` class override)
5. [ ] Tạo glass utility classes: `.glass-panel`, `.glass-card`, `.glass-pill`
6. [ ] Tạo gradient mesh background (animated `radial-gradient` trên `body::before`)
7. [ ] Tạo typography scale: headings (h1–h4), body, code, small
8. [ ] Tạo custom scrollbar styling + `prefers-reduced-motion` support
9. [ ] Update `layout.tsx`: đổi font sang Inter, class `dark` default, metadata mới

## Files to Create/Modify
- `package.json` — Thêm dependencies
- `next.config.ts` — Config updates
- `src/app/globals.css` — Full Liquid Glass design system
- `src/app/layout.tsx` — Inter font, dark class, metadata

## Acceptance Criteria
- [ ] `pnpm install` thành công không lỗi
- [ ] `pnpm dev` chạy được, trang hiển thị với font Inter
- [ ] Background có gradient mesh animation
- [ ] Inspect CSS → thấy đầy đủ CSS variables
- [ ] Thêm class `.glass-panel` vào 1 div → thấy hiệu ứng kính mờ

## Test Criteria
- [ ] Dev server chạy không warning/error
- [ ] Mở browser → thấy dark background + gradient mesh

## Definition of Done
- [ ] Dependencies cài xong
- [ ] CSS design system hoàn chỉnh
- [ ] Layout.tsx updated
- [ ] Dev server chạy OK

## Assumptions / Notes
- Giữ TailwindCSS v4 đã có sẵn, glass utilities viết bằng vanilla CSS bổ sung
- Dark mode dùng class strategy (`.dark` / `.light` trên `<html>`)

---
Next Phase: Phase 02 — Core Library & Sample Content
