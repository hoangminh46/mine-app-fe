# SRS: Mine Knowledge Base — Fullstack Migration

**Version:** 1.1  
**Date:** 2026-05-22  
**Mode:** Standard  
**Author:** Mine (AI Requirements Architect)

---

## 1. Executive Summary

Chuyển đổi Mine Knowledge Base từ ứng dụng static (markdown files) sang ứng dụng fullstack với:
- Đăng nhập Google OAuth2 per-user
- Dữ liệu kiến thức lưu trong Supabase PostgreSQL per-user
- CRUD folders + articles với Markdown editor
- Deploy trên Vercel, toàn bộ free-tier

**Bối cảnh:** Ứng dụng hiện tại đọc `.md` files từ `docs/knowledge/` tại build time. Sau migration, dữ liệu sẽ nằm trong database, mỗi user có knowledge base riêng.

---

## 2. Goal & Scope

### 2.1. Goals
- User có thể đăng nhập bằng Google và quản lý knowledge base cá nhân
- CRUD articles (viết, sửa, xóa) với Markdown editor
- CRUD folders (tạo, sửa, xóa, sắp xếp)
- Giữ nguyên trải nghiệm đọc article (prose, code blocks, TOC, search, progress bar)
- Per-user data isolation (mỗi user chỉ thấy data của mình)

### 2.2. In Scope
- Simple login page (thông tin cơ bản + Google login button)
- Google OAuth2 login/logout
- User profile (avatar, tên)
- Folder CRUD (tạo, đổi tên, xóa, sắp xếp, nested folders)
- Article CRUD (tạo, sửa nội dung markdown, sửa metadata, hard delete với confirm)
- Markdown editor (split-pane: editor + live preview)
- Article reading view (giữ nguyên prose rendering, code blocks, TOC, progress bar)
- Demo data onboarding cho user mới (tạo sẵn folder + article mẫu)
- Search articles (title, tags, content)
- Dashboard (stats, recent articles)
- Database schema + Row Level Security
- Vercel deployment

### 2.3. Out of Scope
- Chia sẻ articles giữa users (v2)
- Real-time collaboration (v2)
- Import/export markdown files (v2)
- Article versioning/history (v2)
- Tags management UI (v2)
- Comments/annotations (v2)
- PWA/offline support (v2)
- Custom domains per user (v2)
- Payment/premium tiers (v2)
- Mobile app native (v2)

### 2.4. Constraints
- **Budget:** $0 — toàn bộ free-tier
- **Platform:** Web (responsive desktop + mobile)
- **Stack:** Next.js 16 + React 19 + Supabase + Vercel
- **Database:** Supabase PostgreSQL free tier (500MB, 50K MAU)
- **Timeline:** Không deadline cứng, chia phase để deliver incremental

---

## 3. Stakeholders & Actors

### 3.1. Primary Actor: Knowledge Owner (User)

| Attribute | Value |
|-----------|-------|
| **Mô tả** | Cá nhân muốn tổ chức kiến thức theo chủ đề |
| **Mục tiêu** | Viết, tổ chức, ôn tập kiến thức cá nhân |
| **Kỹ thuật** | Quen Markdown cơ bản, không cần biết code |
| **Thiết bị** | Desktop chính, mobile xem |
| **Bối cảnh** | Học tập, làm việc, research |

### 3.2. Secondary Actor: Guest (Unauthenticated)

| Attribute | Value |
|-----------|-------|
| **Mô tả** | Người chưa đăng nhập |
| **Mục tiêu** | Xem landing page, đăng nhập |
| **Quyền** | Chỉ thấy login page, không truy cập data |

---

## 4. Core Flows

### 4.1. Flow 1: First-time User Onboarding

```
Guest → Vào trang chủ → Thấy login page (thông tin app + login button)
→ Click "Sign in with Google" → Google OAuth consent
→ Redirect về app → Tự tạo profile + seed demo data
→ Dashboard (có sẵn demo folder + article mẫu)
```

### 4.2. Flow 2: Create & Write Article

```
User → Dashboard → Click "New Article" (hoặc vào folder → New Article)
→ Form: chọn folder, nhập title, slug tự sinh
→ Mở Markdown Editor (split-pane: editor bên trái, preview bên phải)
→ Viết nội dung Markdown → Set metadata (status, difficulty, tags)
→ Click Save → Article lưu vào DB
→ Redirect về article reading view
```

### 4.3. Flow 3: Browse & Read Articles

```
User → Dashboard → Click folder trong sidebar → Thấy article list (grid cards)
→ Click article → Reading view (prose + TOC + progress bar + code blocks)
→ Scroll → TOC highlight theo scroll
→ Click TOC item → Smooth scroll tới heading
```

### 4.4. Flow 4: Edit Article

```
User → Đang đọc article → Click "Edit" button
→ Markdown Editor mở với nội dung hiện tại
→ Sửa content / metadata → Click Save → Cập nhật DB
→ Quay về reading view
```

### 4.5. Flow 5: Manage Folders

```
User → Sidebar → Click "+" icon → Nhập tên folder → Tạo
→ Hoặc: Right-click/menu folder → Rename / Delete
→ Drag & drop để sắp xếp thứ tự (Could have)
```

### 4.6. Flow 6: Search

```
User → Nhấn Ctrl+K → Search modal mở
→ Gõ keyword → Fuzzy search trong title, tags, content excerpt
→ Click result → Navigate tới article
```

---

## 5. Use Cases

### UC-01: Google OAuth Login

| Field | Value |
|-------|-------|
| **Preconditions** | User chưa đăng nhập |
| **Main Flow** | 1. Click "Sign in with Google" → 2. Google consent screen → 3. Grant permission → 4. Redirect về app → 5. Tạo/cập nhật profile → 6. Redirect tới Dashboard |
| **Alternate Flow** | A1: User đã có account → login, không tạo mới profile |
| **Exception Flow** | E1: User deny permission → hiển thị error → quay về login page |
| **Postconditions** | User authenticated, session active, profile exists |

### UC-02: Create Article

| Field | Value |
|-------|-------|
| **Preconditions** | User authenticated, ít nhất 1 folder tồn tại (hoặc tạo root article) |
| **Main Flow** | 1. Click "New Article" → 2. Chọn folder (optional) → 3. Nhập title → 4. Slug tự sinh từ title → 5. Mở editor → 6. Viết markdown → 7. Set metadata → 8. Save |
| **Alternate Flow** | A1: User để trống title → hiển thị validation error |
| **Exception Flow** | E1: Slug trùng trong cùng folder → append number (-2, -3...) |
| **Postconditions** | Article saved, visible in sidebar + folder listing |

### UC-03: Edit Article

| Field | Value |
|-------|-------|
| **Preconditions** | User authenticated, article tồn tại, user là owner |
| **Main Flow** | 1. Click Edit → 2. Editor mở với content hiện tại → 3. Sửa content/metadata → 4. Click Save → 5. updated_at cập nhật |
| **Alternate Flow** | A1: User cancel → quay về reading view, không thay đổi |
| **Exception Flow** | E1: Save fail (network) → hiển thị error toast, giữ draft trong editor |
| **Postconditions** | Article updated, reading view reflect changes |

### UC-04: Delete Article

| Field | Value |
|-------|-------|
| **Preconditions** | User authenticated, article tồn tại |
| **Main Flow** | 1. Click Delete → 2. Confirm dialog ("Bạn có chắc muốn xóa [title]?") → 3. Hard delete from DB → 4. Redirect về folder |
| **Exception Flow** | E1: User cancel confirm → không xóa |
| **Postconditions** | Article removed from DB, sidebar, search index |

### UC-05: CRUD Folder

| Field | Value |
|-------|-------|
| **Preconditions** | User authenticated |
| **Main Flow (Create)** | 1. Click "New Folder" → 2. Nhập name → 3. Slug tự sinh → 4. Folder hiện trong sidebar |
| **Main Flow (Rename)** | 1. Click rename icon → 2. Inline edit → 3. Save |
| **Main Flow (Delete)** | 1. Click delete → 2. Confirm (cảnh báo articles bên trong) → 3. Delete folder + articles |
| **Exception Flow** | E1: Folder name trùng → validation error |
| **Postconditions** | Sidebar tree cập nhật |

---

## 6. User Stories

### Auth & Profile

| ID | Story | Priority |
|----|-------|----------|
| **US-01** | As a guest, I want to sign in with Google, so that I can access my personal knowledge base. | Must |
| **US-02** | As a user, I want to see my avatar and name in the navbar, so that I know I'm logged in. | Must |
| **US-03** | As a user, I want to log out, so that I can secure my session. | Must |
| **US-04** | As a guest, I want to see a landing page, so that I understand what the app does before signing in. | Should |

### Folder Management

| ID | Story | Priority |
|----|-------|----------|
| **US-05** | As a user, I want to create folders, so that I can organize my knowledge by topic. | Must |
| **US-06** | As a user, I want to rename folders, so that I can fix naming mistakes. | Must |
| **US-07** | As a user, I want to delete empty folders, so that I can clean up unused categories. | Must |
| **US-08** | As a user, I want to delete folders with articles (with confirmation), so that I can remove entire topics. | Should |
| **US-09** | As a user, I want to create nested folders, so that I can build a hierarchy. | Could |
| **US-10** | As a user, I want to reorder folders, so that I can prioritize important topics. | Could |

### Article CRUD

| ID | Story | Priority |
|----|-------|----------|
| **US-11** | As a user, I want to create a new article with title, so that I can start writing. | Must |
| **US-12** | As a user, I want to write article content in Markdown, so that I can format text, code, lists, tables. | Must |
| **US-13** | As a user, I want a split-pane editor (Markdown + live preview), so that I can see the result while writing. | Must |
| **US-14** | As a user, I want to set article metadata (status, difficulty, tags), so that I can track learning progress. | Must |
| **US-15** | As a user, I want to edit existing articles, so that I can update knowledge over time. | Must |
| **US-16** | As a user, I want to delete articles (with confirmation), so that I can remove outdated content. | Must |
| **US-17** | As a user, I want the slug to auto-generate from title, so that I don't have to think about URLs. | Should |
| **US-18** | As a user, I want to move articles between folders, so that I can reorganize. | Could |

### Reading & Navigation

| ID | Story | Priority |
|----|-------|----------|
| **US-19** | As a user, I want to read articles with rich rendering (prose, code blocks, tables), so that content is easy to read. | Must |
| **US-20** | As a user, I want a Table of Contents with scroll spy, so that I can navigate long articles. | Must |
| **US-21** | As a user, I want a sidebar tree showing my folders and articles, so that I can browse my knowledge. | Must |
| **US-22** | As a user, I want breadcrumb navigation, so that I know where I am. | Should |
| **US-23** | As a user, I want a reading progress bar, so that I know how far I've read. | Should |
| **US-24** | As a user, I want code blocks with syntax highlighting and copy button, so that I can reuse code. | Must |

### Dashboard & Search

| ID | Story | Priority |
|----|-------|----------|
| **US-25** | As a user, I want a dashboard with stats (total, learning, reviewed, mastered), so that I can track progress. | Must |
| **US-26** | As a user, I want to see recent articles on dashboard, so that I can quickly continue reading. | Should |
| **US-27** | As a user, I want to search articles by title/tags/content with Ctrl+K, so that I can find things fast. | Must |

---

## 7. Acceptance Criteria

### AC-01: Google OAuth Login
```gherkin
Given I am on the login page
When I click "Sign in with Google" and authorize
Then I am redirected to Dashboard
And my avatar and name appear in the navbar
And a profile record exists in the database
```

### AC-02: Create Article
```gherkin
Given I am logged in
When I click "New Article", fill in title "Test Article", select folder "AI"
Then an article is created with auto-generated slug "test-article"
And the article appears in the sidebar under "AI"
And the Markdown editor opens with empty content
```

### AC-03: Edit Article with Markdown Editor
```gherkin
Given I am viewing an article I own
When I click "Edit"
Then the split-pane editor opens with current Markdown content on the left
And live preview renders on the right
When I type "## New Heading" and click Save
Then the article is updated in the database
And the reading view shows the new heading
And updated_at timestamp is refreshed
```

### AC-04: Delete Article
```gherkin
Given I am viewing an article I own
When I click "Delete"
Then a confirmation dialog appears with article title
When I confirm
Then the article is removed from the database
And the sidebar no longer shows the article
And I am redirected to the parent folder
```

### AC-05: Per-user Data Isolation
```gherkin
Given User A has 3 articles
And User B has 5 articles
When User A logs in
Then User A sees only their 3 articles
And User A cannot access User B's articles by URL
```

### AC-06: Dashboard Stats
```gherkin
Given I have 10 articles (4 learning, 3 reviewed, 3 mastered)
When I visit the Dashboard
Then stats show: Total=10, Learning=4, Reviewed=3, Mastered=3
And recent articles show the 5 most recently updated
```

### AC-07: Search
```gherkin
Given I have articles with various titles and tags
When I press Ctrl+K and type a search query
Then results show matching articles from MY knowledge base only
And clicking a result navigates to the article
```

### AC-08: Protected Routes
```gherkin
Given I am not logged in
When I try to access /knowledge/* or /dashboard
Then I am redirected to the login page
```

### AC-09: Folder CRUD
```gherkin
Given I am logged in
When I create a folder named "DevOps"
Then "DevOps" appears in my sidebar
When I rename it to "Infrastructure"
Then the sidebar updates to show "Infrastructure"
When I delete a folder containing articles
Then a warning shows "This will delete X articles"
And upon confirmation, folder and articles are removed
```

---

## 8. Non-Functional Requirements

### 8.1. Performance
| NFR | Target | Measurement |
|-----|--------|-------------|
| Page load (Dashboard) | < 2s | First Contentful Paint |
| Article load | < 1.5s | Time to interactive |
| Search response | < 300ms | Keystroke to results |
| Editor save | < 1s | Click save → confirmation |
| Markdown preview update | < 200ms | Keystroke to preview render |

### 8.2. Security
| NFR | Requirement |
|-----|-------------|
| Authentication | Google OAuth2 via Supabase Auth |
| Authorization | Row Level Security — user chỉ truy cập data của mình |
| Session | Supabase session management, HTTP-only cookies |
| API protection | Server Actions + Middleware route protection |
| Input validation | Server-side validate tất cả input trước khi write DB |
| XSS prevention | Sanitize markdown output trước khi render HTML |

### 8.3. Reliability
| NFR | Requirement |
|-----|-------------|
| Data persistence | Supabase PostgreSQL với backup tự động |
| Error handling | Toast notifications cho user-facing errors |
| Network failure | Editor giữ draft content, retry save |
| DB pause (free tier) | Supabase auto-resume, UI show loading state |

### 8.4. Usability / Accessibility
| NFR | Requirement |
|-----|-------------|
| Responsive | Desktop (1280px+), Tablet (768px), Mobile (375px) |
| Keyboard nav | Tab through interactive elements, Ctrl+K search |
| Focus states | Visible focus ring trên tất cả interactive elements |
| Reduced motion | Respect `prefers-reduced-motion` |
| Theme | Dark/Light mode toggle (đã có) |

### 8.5. Deployment
| NFR | Requirement |
|-----|-------------|
| Platform | Vercel Hobby (free) |
| CI/CD | Auto-deploy on git push |
| Environment | Production + Preview deployments |
| Cost | $0/month (Vercel free + Supabase free) |

---

## 9. Tech Stack (Confirmed)

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Framework** | Next.js 16 + React 19 | Existing, App Router, Server Components |
| **Auth** | Supabase Auth | Google OAuth built-in, session management |
| **Database** | Supabase PostgreSQL | Free 500MB, RLS, real-time capable |
| **ORM** | Drizzle ORM | Type-safe, 50KB bundle, edge-compatible |
| **MD Editor** | @uiw/react-md-editor | Lightweight ~4.6KB gzip, split-pane built-in |
| **MD Render** | unified + remark + rehype | Existing, proven |
| **Search** | Fuse.js (client) | Existing, fuzzy search |
| **Styling** | Vanilla CSS (Liquid Glass) | Existing design system |
| **Deploy** | Vercel | Free hobby tier |

---

## 10. Database Schema

```sql
-- Supabase quản lý auth.users

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, parent_id, slug)
);

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  status TEXT DEFAULT 'learning'
    CHECK (status IN ('learning', 'reviewed', 'mastered')),
  difficulty TEXT DEFAULT 'beginner'
    CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[] DEFAULT '{}',
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, folder_id, slug)
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile"
  ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users manage own folders"
  ON folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own articles"
  ON articles FOR ALL USING (auth.uid() = user_id);
```

---

## 11. Assumptions

1. User dùng Google account để đăng nhập (không cần email/password)
2. Mỗi user có knowledge base hoàn toàn riêng biệt
3. Supabase free tier (500MB, 50K MAU) đủ cho giai đoạn MVP
4. Content được lưu dưới dạng raw Markdown text trong DB
5. Markdown rendering vẫn dùng unified/remark/rehype pipeline hiện tại
6. Search chạy client-side với Fuse.js (fetch all user articles)
7. Không cần realtime sync trong v1
8. `docs/knowledge/` sẽ bị xóa sau migration

---

## 12. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase free tier DB pause sau 1 tuần inactive | UX delay ~5s khi resume | Loading state, cron ping nếu cần |
| 500MB storage limit | Hết dung lượng | Monitor usage, nén content nếu cần |
| XSS qua Markdown content | Security vulnerability | Sanitize HTML output từ remark/rehype |
| Editor preview khác reading view | UX confusion | Dùng cùng CSS classes cho preview |
| Google OAuth redirect issues trên Vercel preview | Login fail | Dùng AUTH_REDIRECT_PROXY_URL |
| Search chậm khi >1000 articles | UX lag | Migrate sang Supabase full-text search |

---

## 13. Resolved Questions

| Question | Decision |
|----------|----------|
| Q1: Landing page | Simple login page (thông tin cơ bản + login button, không cần marketing) |
| Q2: Onboarding | Tạo demo data (folder + article mẫu) cho user mới |
| Q3: Delete behavior | Hard delete + confirmation dialog |
| Q4: Slug | Auto-generate từ title, user không cần quản lý |

---

## 14. Prioritization (MoSCoW)

| Priority | Items |
|----------|-------|
| **Must** | Google OAuth, CRUD articles, CRUD folders, MD editor, reading view, sidebar tree, search, dashboard stats, RLS, protected routes |
| **Should** | Landing page, breadcrumb, progress bar, recent articles, metadata (status/difficulty/tags), auto-slug |
| **Could** | Nested folders, reorder folders/articles, move article between folders |
| **Won't (v1)** | Share, collaboration, versioning, import/export, comments, PWA, payment |

---

## 15. Handoff to /plan

SRS này đủ để chuyển sang `/plan`:
- ✅ Scope rõ (in/out)
- ✅ 27 user stories với priority
- ✅ 9 acceptance criteria
- ✅ 5 use cases
- ✅ NFRs đo được
- ✅ Tech stack confirmed
- ✅ DB schema draft
- ✅ Assumptions + Risks documented
