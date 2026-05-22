# Phase 09: Responsive, Polish & Verification
Status: ✅ Complete
Dependencies: Phase 01–08

## Objective
Hoàn thiện responsive design cho mobile/tablet, thêm animations, kiểm tra accessibility, và verify build cuối cùng.

## Why This Phase Exists
Phase cuối đảm bảo app hoạt động tốt trên mọi thiết bị, có polish chuyên nghiệp, và sẵn sàng deploy.

## Scope
### In Scope
- Mobile responsive: sidebar overlay, TOC hide
- Tablet responsive: 2-column layout
- Micro-animations và transitions
- Accessibility check (contrast, focus, keyboard)
- Build verification

### Out of Scope
- PWA support (v2)
- Performance profiling chi tiết (v2)
- SEO optimization nâng cao (v2)

## Requirements
### Functional
- [ ] Mobile (<768px): sidebar ẩn, hamburger button → slide-in overlay
- [ ] Mobile: TOC ẩn hoàn toàn
- [ ] Mobile: content full width, padding giảm
- [ ] Tablet (768–1024px): sidebar + content, TOC ẩn
- [ ] Click hamburger → sidebar overlay slide in từ trái
- [ ] Click backdrop / article link → sidebar overlay đóng

### Non-Functional
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Focus states visible cho keyboard navigation
- [ ] Color contrast ratio ≥ 4.5:1 cho text
- [ ] No layout shift khi load
- [ ] `pnpm build` thành công, 0 errors, 0 warnings

## Implementation Steps
1. [ ] Mobile sidebar: thêm hamburger button vào Navbar (hiện khi <768px), sidebar → fixed overlay + backdrop blur
2. [ ] Mobile sidebar animation: slide-in từ trái (`transform: translateX`), close khi click backdrop hoặc navigate
3. [ ] Mobile content: full width, giảm horizontal padding, font-size adjust nhẹ
4. [ ] Tablet layout: ẩn TOC, sidebar + content 2 cột, adjust sidebar width
5. [ ] Thêm entrance animations: page content fade-in + slide-up nhẹ khi navigate tới article mới
6. [ ] Thêm micro-interactions: sidebar items hover glow, card hover lift (`translateY(-2px)`), button press scale
7. [ ] Accessibility: thêm `aria-label`, `aria-expanded` cho hamburger, `role="navigation"` cho sidebar, `role="search"` cho search
8. [ ] Accessibility: kiểm tra + thêm focus-visible styles cho tất cả interactive elements
9. [ ] Kiểm tra `prefers-reduced-motion` — wrap animations trong media query, disable khi user prefer reduced
10. [ ] Final verification: `pnpm build`, check output, test trên 3 breakpoints (375px, 768px, 1280px)

## Files to Create/Modify
- `src/components/Navbar.tsx` — Add hamburger button, mobile state (MODIFY)
- `src/components/Sidebar.tsx` — Mobile overlay mode (MODIFY)
- `src/app/knowledge/layout.tsx` — Responsive breakpoints (MODIFY)
- `src/app/globals.css` — Media queries, animations, a11y (MODIFY)
- `src/components/TableOfContents.tsx` — Hide on mobile/tablet (MODIFY)

## Acceptance Criteria
- [ ] Mobile (375px width): sidebar ẩn, hamburger hiện, click → overlay, content full width
- [ ] Tablet (768px): sidebar + content 2 cột, TOC ẩn
- [ ] Desktop (1280px): 3 cột đầy đủ
- [ ] Tab through page → focus ring visible trên tất cả buttons/links
- [ ] OS setting `prefers-reduced-motion: reduce` → no animations
- [ ] `pnpm build` thành công, 0 errors

## Test Criteria
- [ ] Resize browser 375 → 768 → 1280 → layout chuyển đúng, không break
- [ ] Mobile: hamburger → sidebar open → click article → sidebar close + navigate
- [ ] Keyboard-only: Tab qua sidebar items → Enter to select → navigate
- [ ] Lighthouse accessibility score ≥ 90

## Definition of Done
- [ ] Responsive 3 breakpoints hoạt động
- [ ] Animations smooth + respect reduced motion
- [ ] Accessibility checked
- [ ] `pnpm build` thành công
- [ ] 🎉 Ready to deploy!

## Assumptions / Notes
- Breakpoints: mobile < 768px, tablet 768–1024px, desktop > 1024px
- Sidebar overlay: CSS `transform` + `transition` (no JS animation library)
- Hamburger icon: 3-line SVG, animate → X khi open
- Final check bằng browser DevTools responsive mode

---
🎉 All phases complete! App sẵn sàng deploy lên Vercel / GitHub Pages.
