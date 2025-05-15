import { ArticleForm } from "@/components/article/article-form";
import { PageHeader } from "@/components/page-header";
import { articleService } from "@/services";
import { dummyArticles } from "@/utils";

interface AdminEditArticlePageProps {
  params: {
    id: string;
  };
}

export default async function AdminEditArticlePage({
  params,
}: AdminEditArticlePageProps) {
  // Get article data
  let article;
  try {
    const response = await articleService.getArticle(params.id);
    if (response.status) {
      article = response.data;
    } else {
      throw new Error("Failed to fetch article");
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    // Fallback to dummy data
    article = dummyArticles.find((a) => a.id === params.id);
  }

  if (!article) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Article" />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Article not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Article"
        description={`Editing: ${article.title}`}
      />
      <ArticleForm article={article} isEditing={true} />
    </div>
  );
}
