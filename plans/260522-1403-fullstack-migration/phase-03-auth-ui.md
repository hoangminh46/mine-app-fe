# Phase 03: Auth UI + Protected Routes

Status: ⬜ Pending  
Dependencies: Phase 02

## Objective

Tạo login page, logout flow, user avatar trong navbar, route protection middleware, và auth context.

## Implementation Steps

1. [ ] Tạo login page: `src/app/login/page.tsx` — thông tin app + "Sign in with Google" button
2. [ ] Tạo auth callback route: `src/app/auth/callback/route.ts` — handle OAuth redirect
3. [ ] Tạo server action: `src/lib/actions/auth.ts` — signInWithGoogle, signOut
4. [ ] Update `src/middleware.ts` — redirect unauthenticated users tới /login, authenticated users từ /login tới /
5. [ ] Update `Navbar.tsx` — hiển thị user avatar + tên + logout button (thay vì static)
6. [ ] Tạo auth helper: `src/lib/auth.ts` — getUser() server-side utility
7. [ ] Verify: Login flow end-to-end (login → redirect → navbar avatar → logout)

## Files to Create/Modify

- `src/app/login/page.tsx` — [NEW] Login page
- `src/app/auth/callback/route.ts` — [NEW] OAuth callback handler
- `src/lib/actions/auth.ts` — [NEW] Auth server actions
- `src/lib/auth.ts` — [NEW] Auth utilities
- `src/middleware.ts` — [MODIFY] Add route protection
- `src/components/Navbar.tsx` — [MODIFY] User avatar + logout

## Acceptance Criteria

- [ ] Login page hiển thị đúng (info + Google button)
- [ ] Click "Sign in with Google" → Google consent → redirect về app
- [ ] Navbar hiển thị avatar + display name sau login
- [ ] Logout xóa session, redirect về /login
- [ ] Routes /knowledge/* và / bị redirect tới /login nếu chưa auth
- [ ] /login redirect tới / nếu đã auth

## Definition of Done

- [ ] Auth flow hoạt động end-to-end
- [ ] Protected routes verified
- [ ] `npm run build` thành công

---
Next Phase: phase-04-data-layer.md
