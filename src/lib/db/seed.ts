import { createClient } from "@/lib/supabase/server";

export async function seedDemoData(userId: string) {
  const supabase = await createClient();

  // Check if user already has data (avoid re-seeding)
  const { count } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (count && count > 0) return;

  // Step 1: Create demo folder
  const { data: folder } = await supabase
    .from("folders")
    .insert({
      user_id: userId,
      name: "Getting Started",
      slug: "getting-started",
      order: 0,
    })
    .select("id")
    .single();

  if (!folder) return;

  // Step 2: Create welcome article
  await supabase.from("articles").insert([
    {
      user_id: userId,
      folder_id: folder.id,
      title: "Chào mừng đến Mine Knowledge Base",
      slug: "chao-mung-den-mine-knowledge-base",
      content: WELCOME_CONTENT,
      status: "learning",
      difficulty: "beginner",
      tags: ["welcome", "guide"],
      order: 0,
    },
    {
      user_id: userId,
      folder_id: folder.id,
      title: "Hướng dẫn viết Markdown",
      slug: "huong-dan-viet-markdown",
      content: MARKDOWN_GUIDE_CONTENT,
      status: "learning",
      difficulty: "beginner",
      tags: ["markdown", "guide"],
      order: 1,
    },
  ]);
}

const WELCOME_CONTENT = `# Chào mừng đến Mine Knowledge Base! 🎉

Đây là nơi bạn lưu trữ, tổ chức và học tập kiến thức cá nhân.

## Bắt đầu nhanh

### 1. Tạo Folder
Click nút **+** ở sidebar để tạo folder phân loại kiến thức.

### 2. Tạo Bài viết
Click nút **📝** ở sidebar hoặc dùng editor để viết bài mới.

### 3. Tổ chức kiến thức
- **Status**: Learning → Reviewed → Mastered
- **Difficulty**: Beginner → Intermediate → Advanced
- **Tags**: Gắn tags để dễ tìm kiếm

### 4. Tìm kiếm nhanh
Nhấn \`Ctrl + K\` để mở search — tìm theo title, tags, hoặc nội dung.

## Tips
- Viết bài bằng **Markdown** — editor hỗ trợ live preview
- Dùng **headings** (## và ###) để tạo Table of Contents tự động
- Gắn **tags** để nhóm bài viết theo chủ đề

Chúc bạn học tập hiệu quả! 🚀
`;

const MARKDOWN_GUIDE_CONTENT = `# Hướng dẫn Markdown cơ bản

## Headings

\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
\`\`\`

## Text formatting

| Cú pháp | Kết quả |
|---------|---------|
| \`**bold**\` | **bold** |
| \`*italic*\` | *italic* |
| \`~~strikethrough~~\` | ~~strikethrough~~ |
| \`\\\`inline code\\\`\` | \`inline code\` |

## Lists

\`\`\`markdown
- Item 1
- Item 2
  - Sub item

1. First
2. Second
\`\`\`

## Links & Images

\`\`\`markdown
[Link text](https://example.com)
![Alt text](image-url.jpg)
\`\`\`

## Code blocks

Dùng 3 backticks với tên ngôn ngữ:

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Blockquotes

> Đây là blockquote.
> Có thể nhiều dòng.

## Tables

\`\`\`markdown
| Cột 1 | Cột 2 |
|-------|-------|
| A     | B     |
\`\`\`

Hãy thử viết bài đầu tiên của bạn! ✍️
`;
