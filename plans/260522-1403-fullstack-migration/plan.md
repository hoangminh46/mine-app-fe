# Plan: Fullstack Migration — Supabase Auth + DB

Created: 2026-05-22T14:03  
Status: 🟡 In Progress  
SRS: [docs/SRS.md](../../docs/SRS.md)

## Overview

Chuyển Mine Knowledge Base từ static markdown sang fullstack app với Supabase (Auth + PostgreSQL), per-user data, Markdown editor, deploy Vercel free-tier.

## Goal

- User đăng nhập Google → quản lý KB cá nhân
- CRUD folders + articles với Markdown editor
- Per-user data isolation (RLS)
- Deploy Vercel, $0/month

## Scope

### In Scope
- Simple login page + Google OAuth2
- Profile (avatar, name)
- Folder CRUD (create, rename, delete, nested)
- Article CRUD (create, edit, delete with confirm)
- Split-pane Markdown editor + live preview
- Reading view (prose, code blocks, TOC, progress bar)
- Dashboard (stats, recent articles)
- Search (Ctrl+K, fuzzy)
- Demo data onboarding
- Vercel deployment

### Out of Scope
- Share articles, collaboration, versioning
- Import/export, comments, PWA, payments

## Actors

- **User**: Đăng nhập Google, quản lý KB cá nhân
- **Guest**: Chỉ thấy login page

## Core Entities

- `profiles` — user profile (id, display_name, avatar_url)
- `folders` — knowledge folders (id, user_id, name, slug, parent_id, order)
- `articles` — knowledge articles (id, user_id, folder_id, title, slug, content, status, difficulty, tags)

## Assumptions

1. Supabase free tier (500MB, 50K MAU) đủ cho MVP
2. Content lưu raw Markdown trong DB, render bằng unified/remark/rehype
3. Search client-side với Fuse.js
4. Hard delete + confirmation dialog
5. Slug auto-generate từ title

## Risks

| Risk | Mitigation |
|------|------------|
| DB pause sau 1 tuần inactive | Loading state + cron ping |
| XSS qua Markdown | Sanitize HTML từ rehype |
| Editor preview ≠ reading view | Dùng cùng CSS classes |
| OAuth redirect issues trên preview | AUTH_REDIRECT_PROXY_URL |

## Acceptance Criteria

- [ ] User đăng nhập Google thành công
- [ ] User tạo/sửa/xóa folders
- [ ] User tạo/sửa/xóa articles với Markdown editor
- [ ] Reading view render đúng (prose, code blocks, TOC)
- [ ] Dashboard hiển thị stats + recent articles
- [ ] Search tìm đúng articles của user
- [ ] User A không thấy data của User B
- [ ] Demo data được seed cho user mới
- [ ] Deploy Vercel thành công

## Phases

| Phase | Name | Tasks | Status | Depends On |
|-------|------|-------|--------|------------|
| 01 | Supabase Setup + Auth | 8 | ⬜ Pending | - |
| 02 | Database Schema + Drizzle ORM | 7 | ⬜ Pending | 01 |
| 03 | Auth UI + Protected Routes | 7 | ⬜ Pending | 02 |
| 04 | Data Layer Migration | 8 | ⬜ Pending | 03 |
| 05 | Folder CRUD | 6 | ⬜ Pending | 04 |
| 06 | Article CRUD + Markdown Editor | 10 | ⬜ Pending | 05 |
| 07 | Dashboard + Search + Onboarding + Polish | 11 | ⬜ Pending | 06 |

## Quick Commands

- Start current phase: `/code phase-01`
- Check progress: `/next`
- Visualize UI: `/visualize`
- Save context: `/save-brain`
