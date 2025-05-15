import { ArticleList } from "@/components/article/article-list";
import { PageHeader } from "@/components/page-header";

export default function UserArticlesPage() {
  return (
    <div className="space-y-8">
      <div className="py-8 px-6 -mx-6 mb-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <PageHeader
          title="Discover Articles"
          description="Explore insightful articles on various topics"
          className="text-center max-w-2xl mx-auto"
        />
      </div>
      <ArticleList />
    </div>
  );
}
