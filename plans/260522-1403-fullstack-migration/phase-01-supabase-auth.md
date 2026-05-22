# Phase 01: Supabase Setup + Auth Foundation

Status: 🟡 In Progress  
Dependencies: None

## Objective

Khởi tạo Supabase project, cài đặt dependencies, cấu hình Google OAuth, và tạo Supabase client utils cho Next.js.

## Implementation Steps

1. [ ] Tạo Supabase project tại [supabase.com](https://supabase.com) — **⏳ Anh làm thủ công**
2. [ ] Enable Google OAuth provider trong Supabase Dashboard — **⏳ Anh làm thủ công**
3. [ ] Cấu hình Google Cloud Console: OAuth2 credentials — **⏳ Anh làm thủ công**
4. [x] Cài dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `drizzle-orm`, `postgres`, `drizzle-kit`
5. [x] Tạo `.env.example` với template cho env vars
6. [x] Tạo Supabase client utilities:
   - `src/lib/supabase/server.ts` — Server Component client
   - `src/lib/supabase/client.ts` — Browser client
   - `src/lib/supabase/middleware.ts` — Middleware client (session refresh + route protection)
7. [x] Tạo `src/middleware.ts` — Next.js middleware entry point
8. [x] Tạo `src/lib/auth.ts` — getUser() utility
9. [x] Verify: `npm run build` thành công, TypeScript 0 errors

## Notes

- ⚠️ Next.js 16 deprecate `middleware` convention → khuyên dùng `proxy`. Chức năng giữ nguyên, có thể rename sau.
- Steps 1-3 cần anh tạo Supabase project + Google OAuth credentials thủ công
- Sau khi anh có URL + Anon Key → tạo `.env.local` theo `.env.example`

---
Next Phase: phase-02-database-schema.md
