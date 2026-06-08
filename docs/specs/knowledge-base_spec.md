# Spec: Mine Knowledge Base — Liquid Glass Edition
Created: 2026-05-22

## 1. Executive Summary
Web app cá nhân để lưu trữ và học tập kiến thức, dựa trên file Markdown. Giao diện Liquid Glass premium lấy cảm hứng từ Apple WWDC 2025. Không cần backend — Next.js đọc file `.md` tại build time, sinh static pages.

## 2. Goal and Non-Goals

### Goals
- Tổ chức kiến thức theo cấu trúc folder cha-con
- Render markdown đẹp trên web với syntax highlighting
- Tìm kiếm nhanh across tất cả bài viết
- Track tiến độ học tập (learning → reviewed → mastered)
- Giao diện Liquid Glass premium, dark mode mặc định

### Non-Goals
- Không làm CMS / editor trên web
- Không làm multi-user / collaboration
- Không làm spaced repetition / quiz (v2)
- Không làm AI-powered features (v2)

## 3. Actors / Roles
- **Owner** (anh): Viết file .md bằng editor ngoài, đọc bài trên web, track progress

## 4. User Stories
- US01: Là owner, tôi muốn xem danh sách tất cả chủ đề trên sidebar để navigate nhanh
- US02: Là owner, tôi muốn click vào bài viết và đọc markdown rendered đẹp
- US03: Là owner, tôi muốn search bài viết bằng Ctrl+K để tìm nhanh
- US04: Là owner, tôi muốn xem TOC bên phải để jump tới section cần đọc
- US05: Là owner, tôi muốn toggle dark/light mode tùy thời điểm
- US06: Là owner, tôi muốn xem dashboard tổng quan (bao nhiêu bài, đang học bao nhiêu)
- US07: Là owner, tôi muốn copy code block nhanh để dùng
- US08: Là owner, tôi muốn biết mình đang đọc tới đâu trong bài (progress bar)

## 5. Domain Entities and Relationships

### KnowledgeFolder
```
- slug: string        // "ai", "english"
- title: string       // Derived from folder name, capitalized
- order: number       // Alphabetical default
- children: KnowledgeNode[]
```

### KnowledgeArticle
```
- slug: string        // "ai/prompt-engineering"
- title: string       // From frontmatter or filename
- tags: string[]      // From frontmatter
- status: enum        // 'learning' | 'reviewed' | 'mastered'
- difficulty: enum    // 'beginner' | 'intermediate' | 'advanced'
- order: number       // From frontmatter, default 999
- created: string     // ISO date
- updated: string     // ISO date
- content: string     // Raw markdown
- htmlContent: string // Rendered HTML
- headings: Heading[] // Extracted h2/h3/h4
- readingTime: number // Estimated minutes
```

### Relationships
```
KnowledgeFolder 1 ──→ N KnowledgeArticle
KnowledgeFolder 1 ──→ N KnowledgeFolder (nested, nếu cần)
```

## 6. Core Flows

### Flow 1: Browse & Read
```
User mở web → Dashboard hiển thị stats
→ Click sidebar folder → Expand children
→ Click article → Render markdown + TOC + metadata
→ Scroll đọc bài → Progress bar cập nhật
→ TOC highlight heading đang đọc
```

### Flow 2: Search
```
User nhấn Ctrl+K → Search modal hiện (glass overlay)
→ Gõ keyword → Fuzzy search results hiện realtime
→ Dùng ↑↓ để navigate, Enter để mở
→ Redirect tới article page
```

### Flow 3: Add New Content
```
User tạo file .md trong docs/knowledge/[folder]/
→ Thêm YAML frontmatter (title, tags, status, etc.)
→ Viết nội dung markdown
→ pnpm build → Static pages regenerated
→ Deploy → Bài mới hiển thị trên web
```

## 7. Edge Cases / Failure States
- File .md không có frontmatter → Fallback: dùng filename làm title, status = 'learning'
- Folder rỗng → Hiển thị empty state "Chưa có bài viết nào"
- Code block không có language → Render plain text, không highlight
- Nested folder sâu > 2 level → Support nhưng sidebar chỉ hiện 2 level
- Search không có kết quả → Hiển thị "Không tìm thấy kết quả"
- Broken markdown syntax → Render best-effort, không crash page

## 8. API Contract
Không có API — tất cả data đọc từ filesystem tại build time.

## 9. Data Design
- **Source of truth**: File `.md` trong `docs/knowledge/`
- **Build-time processing**: `lib/knowledge.ts` scan folders, parse frontmatter, render HTML
- **Search index**: JSON file generated at build time, loaded client-side
- **User preferences**: `localStorage` (theme, sidebar state)
- **Reading progress**: Không persist (chỉ hiện khi đang đọc)

## 10. UI Components / Screens

| Screen | Route | Components |
|--------|-------|------------|
| Dashboard | `/` | Navbar, StatsCards, RecentArticles |
| Article | `/knowledge/[...slug]` | Navbar, Sidebar, Breadcrumb, ArticleMeta, MarkdownContent, CodeBlock, TOC, ProgressBar |
| Folder Listing | `/knowledge/[folder]` | Navbar, Sidebar, Breadcrumb, FolderListing |
| Search (Modal) | Overlay on any page | SearchModal |

## 11. Integrations / Scheduled Tasks
Không có.

## 12. Acceptance Criteria
- [ ] Dashboard hiển thị đúng stats (tổng bài, learning, reviewed, mastered)
- [ ] Sidebar hiển thị đúng tree structure từ folder
- [ ] Article page render markdown đẹp, code highlighted
- [ ] Copy code button hoạt động
- [ ] TOC scroll spy hoạt động
- [ ] Search Ctrl+K hoạt động, fuzzy search, keyboard nav
- [ ] Dark/Light toggle hoạt động, persist
- [ ] Mobile responsive
- [ ] `pnpm build` thành công

## 13. Risks / Assumptions / Open Questions

### Risks
- `backdrop-filter` performance → Chỉ dùng cho nav elements
- Large search index → Lazy load, chỉ index metadata + excerpt

### Assumptions
- Personal use only, no auth
- < 500 articles
- localStorage for preferences

### Open Questions
- Có cần support nested folder > 2 levels không? → Assumption: support nhưng UI chỉ show 2 levels
- Có cần export PDF không? → Out of scope v1

## 14. Build Checklist
- [ ] Phase 01: Foundation
- [ ] Phase 02: Core Library
- [ ] Phase 03: Navigation
- [ ] Phase 04: Article Rendering
- [ ] Phase 05: TOC & Search
- [ ] Phase 06: Dashboard & Folder
- [ ] Phase 07: Polish & Verify
