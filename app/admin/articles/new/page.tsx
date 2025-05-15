import { ArticleForm } from "@/components/article/article-form";
import { PageHeader } from "@/components/page-header";

export default function AdminNewArticlePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Article"
        description="Create a new article for your site"
      />
      <ArticleForm />
    </div>
  );
}
