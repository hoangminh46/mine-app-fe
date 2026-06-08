# Phase 07: Dashboard + Search + Onboarding + Polish

Status: ⬜ Pending  
Dependencies: Phase 06

## Objective

Dashboard hiển thị stats + recent articles từ DB. Search tìm trong DB data. User mới nhận demo data. Loading/error/empty states.

## Implementation Steps

1. [ ] Update `src/app/page.tsx` (Dashboard) — fetch stats + recent articles từ DB queries
2. [ ] Tạo DB queries: `src/lib/db/queries/dashboard.ts` — getStats(), getRecentArticles()
3. [ ] Update `SearchModal.tsx` — build search index từ DB data thay vì static
4. [ ] Update `src/lib/search.ts` — fetch articles từ DB cho search index
5. [ ] Update `src/app/layout.tsx` — search index từ DB (per-user)
6. [ ] Tạo `src/lib/db/seed.ts` — demo data: 1 folder + 2 articles mẫu
7. [ ] Integrate seed vào auth callback — nếu user mới (first login), chạy seed
8. [ ] Thêm loading states: sidebar skeleton, article loading, dashboard skeleton
9. [ ] Thêm error handling: toast notifications cho CRUD failures
10. [ ] Thêm empty states: no articles, no folders, no search results
11. [ ] Verify: Dashboard stats đúng, search tìm đúng, new user có demo data

## Files to Create/Modify

- `src/lib/db/queries/dashboard.ts` — [NEW] Dashboard queries
- `src/lib/db/seed.ts` — [NEW] Demo data seeder
- `src/app/page.tsx` — [MODIFY] DB-based dashboard
- `src/app/layout.tsx` — [MODIFY] DB-based search index
- `src/lib/search.ts` — [MODIFY] DB-based search
- `src/components/SearchModal.tsx` — [MODIFY] (nếu cần)
- `src/app/auth/callback/route.ts` — [MODIFY] Seed on first login
- Various components — [MODIFY] Loading/error/empty states
- `src/app/globals.css` — [MODIFY] Skeleton + toast styles

## Acceptance Criteria

- [ ] Dashboard stats: total, learning, reviewed, mastered đúng từ DB
- [ ] Recent articles hiển thị 5 bài mới nhất từ DB
- [ ] Ctrl+K search tìm trong articles của user hiện tại
- [ ] User mới đăng nhập → nhận demo folder + articles
- [ ] User cũ đăng nhập → không seed lại
- [ ] Loading states hiển thị khi fetch data
- [ ] Error toast hiện khi CRUD fail
- [ ] Empty states có hướng dẫn hành động

## Definition of Done

- [ ] Dashboard, search, onboarding working
- [ ] Loading/error/empty states implemented
- [ ] `npm run build` thành công 0 errors

---
🎉 Migration Complete! (Deploy do anh tự handle)
