import { ArticleDetail } from "@/components/article/article-detail";
import { PageHeader } from "@/components/page-header";

export default function UserArticleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <PageHeader title="Article Detail" />
      <ArticleDetail articleId={params.id} />
    </div>
  );
}
