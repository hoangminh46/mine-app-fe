import { notFound } from "next/navigation";
import { getArticle, getAllArticles, getArticlesByFolder, isFolder } from "@/lib/knowledge";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleMeta from "@/components/ArticleMeta";
import MarkdownContent from "@/components/MarkdownContent";
import ProgressBar from "@/components/ProgressBar";
import TableOfContents from "@/components/TableOfContents";
import FolderListing from "@/components/FolderListing";

interface ArticlePageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();

  // Generate params for each article
  const articleParams = articles.map((article) => ({
    slug: article.slug.split("/"),
  }));

  // Generate params for each unique folder
  const folderSlugs = new Set<string>();
  articles.forEach((article) => {
    const parts = article.slug.split("/");
    // Build folder paths: e.g. "ai/sub" -> ["ai", "ai/sub"]
    for (let i = 1; i < parts.length; i++) {
      folderSlugs.add(parts.slice(0, i).join("/"));
    }
  });

  const folderParams = Array.from(folderSlugs).map((slug) => ({
    slug: slug.split("/"),
  }));

  return [...articleParams, ...folderParams];
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) return { title: "Knowledge Base" };

  // Check if folder
  if (isFolder(slug)) {
    const folderName = slug[slug.length - 1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return { title: `${folderName} — Mine KB` };
  }

  const article = await getArticle(slug);
  if (!article) return { title: "Not Found" };

  return {
    title: `${article.frontmatter.title} — Mine KB`,
    description: article.excerpt,
  };
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

  // Folder detection — show folder listing
  if (isFolder(slug)) {
    const folderSlug = slug.join("/");
    const articles = await getArticlesByFolder(folderSlug);
    const folderName = slug[slug.length - 1];

    return (
      <div className="article-layout">
        <div className="article-content">
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumb slugParts={slug} />
          </div>
          <FolderListing folderName={folderName} articles={articles} />
        </div>
        <div className="article-toc" />
      </div>
    );
  }

  // Article rendering
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="article-layout">
      <ProgressBar />

      <div className="article-content">
        <div style={{ marginBottom: "1.5rem" }}>
          <Breadcrumb slugParts={slug} />
        </div>
        <ArticleMeta
          frontmatter={article.frontmatter}
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
