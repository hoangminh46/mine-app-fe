# Phase 02: Database Schema + Drizzle ORM

Status: ⬜ Pending  
Dependencies: Phase 01

## Objective

Tạo database schema (profiles, folders, articles), Row Level Security policies, và Drizzle ORM schema definitions.

## Implementation Steps

1. [ ] Tạo Drizzle config: `drizzle.config.ts`
2. [ ] Tạo Drizzle schema: `src/lib/db/schema.ts` — profiles, folders, articles tables
3. [ ] Tạo Drizzle client: `src/lib/db/index.ts` — kết nối Supabase PostgreSQL
4. [ ] Chạy SQL migration trên Supabase Dashboard → SQL Editor:
   - CREATE TABLE profiles, folders, articles
   - Enable RLS trên cả 3 tables
   - CREATE POLICY cho per-user isolation
5. [ ] Tạo database trigger: auto-create profile khi user sign up
6. [ ] Tạo `src/lib/db/types.ts` — shared TypeScript types từ schema
7. [ ] Verify: Query test — insert/select/delete qua Drizzle client

## Files to Create/Modify

- `drizzle.config.ts` — [NEW] Drizzle configuration
- `src/lib/db/schema.ts` — [NEW] Drizzle table definitions
- `src/lib/db/index.ts` — [NEW] Drizzle client instance
- `src/lib/db/types.ts` — [NEW] Shared types
- `package.json` — [MODIFY] Add drizzle scripts

## Acceptance Criteria

- [ ] Tables created trong Supabase: profiles, folders, articles
- [ ] RLS enabled + policies đúng cho per-user isolation
- [ ] Drizzle schema matches SQL schema
- [ ] Drizzle client kết nối thành công
- [ ] Profile tự tạo khi user sign up (trigger)
- [ ] CRUD operations qua Drizzle hoạt động

## Definition of Done

- [ ] Schema deployed trên Supabase
- [ ] `npm run build` thành công
- [ ] Type-safe queries working

---
Next Phase: phase-03-auth-ui.md
