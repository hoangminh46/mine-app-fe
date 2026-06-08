import { notFound } from "next/navigation";
import { getArticleForEdit } from "@/lib/actions/articles";
import { getFolderTree } from "@/lib/db/queries/folders";
import ArticleEditor from "@/components/ArticleEditor";

interface EditorPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: EditorPageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return { title: "Bài viết mới — Mine KB" };
  }
  return { title: "Chỉnh sửa — Mine KB" };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { slug } = await params;
  const folders = await getFolderTree();

  // Edit mode: slug = article slug
  if (slug && slug.length > 0) {
    const articleSlug = slug[slug.length - 1];
    const article = await getArticleForEdit(articleSlug);

    if (!article) {
      notFound();
    }

    return (
      <ArticleEditor
        mode="edit"
        articleId={article.id}
        initialData={{
          title: article.title,
          content: article.content,
          folderId: article.folder_id,
          status: article.status,
          difficulty: article.difficulty,
          tags: article.tags || [],
        }}
        folders={folders}
      />
    );
  }

  // Create mode
  return <ArticleEditor mode="create" folders={folders} />;
}
