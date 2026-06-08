import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/db/queries/articles";
import { getArticlesByFolder } from "@/lib/db/queries/articles";
import { getFolderBySlug } from "@/lib/db/queries/folders";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleMeta from "@/components/ArticleMeta";
import MarkdownContent from "@/components/MarkdownContent";
import ProgressBar from "@/components/ProgressBar";
import TableOfContents from "@/components/TableOfContents";
import FolderListing from "@/components/FolderListing";
import ArticleActions from "@/components/ArticleActions";

interface ArticlePageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) return { title: "Knowledge Base" };

  // Last segment could be folder or article slug
  const articleSlug = slug[slug.length - 1];
  const folderSlug = slug.join("/");

  // Try folder first
  const folder = await getFolderBySlug(folderSlug);
  if (folder) {
    return { title: `${folder.name} — Mine KB` };
  }

  // Try article
  const article = await getArticleBySlug(articleSlug);
  if (article) {
    return {
      title: `${article.title} — Mine KB`,
      description: article.excerpt,
    };
  }

  return { title: "Not Found" };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Empty slug — "select an article" prompt
  if (!slug || slug.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - var(--navbar-height))",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📖</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Chọn một bài viết
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", maxWidth: "320px" }}>
            Chọn bài viết từ sidebar bên trái để bắt đầu đọc, hoặc dùng{" "}
            <kbd className="dashboard-kbd">Ctrl K</kbd> để tìm kiếm.
          </p>
        </div>
      </div>
    );
  }

  // Check if slug matches a folder (e.g. /knowledge/javascript)
  const folderSlug = slug.join("/");
  const folder = await getFolderBySlug(folderSlug);

  if (folder) {
    const articles = await getArticlesByFolder(folder.id);
    return (
      <div className="article-layout">
        <div className="article-content">
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumb slugParts={slug} />
          </div>
          <FolderListing
            folderName={folder.name}
            articles={articles.map((a) => ({
              frontmatter: {
                title: a.title,
                tags: a.tags,
                order: 0,
                status: a.status as "learning" | "reviewed" | "mastered",
                difficulty: a.difficulty as "beginner" | "intermediate" | "advanced",
                created: a.createdAt,
                updated: a.updatedAt,
              },
              slug: `${folderSlug}/${a.slug}`,
              readingTime: a.readingTime,
              excerpt: a.excerpt,
            }))}
          />
        </div>
        <div className="article-toc" />
      </div>
    );
  }

  // Article rendering — try the last segment as article slug
  const articleSlug = slug[slug.length - 1];
  const article = await getArticleBySlug(articleSlug);

  if (!article) {
    notFound();
  }

  return (
    <div className="article-layout">
      <ProgressBar />

      <div className="article-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <Breadcrumb slugParts={slug} />
          <ArticleActions articleId={article.id} articleSlug={article.slug} />
        </div>
        <ArticleMeta
          frontmatter={{
            title: article.title,
            tags: article.tags,
            order: 0,
            status: article.status as "learning" | "reviewed" | "mastered",
            difficulty: article.difficulty as "beginner" | "intermediate" | "advanced",
            created: article.createdAt,
            updated: article.updatedAt,
          }}
          readingTime={article.readingTime}
        />
        <MarkdownContent htmlContent={article.htmlContent} />
      </div>

      <div className="article-toc">
        <TableOfContents headings={article.headings} />
      </div>
    </div>
  );
}
