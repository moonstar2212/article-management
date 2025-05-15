import Link from "next/link";
import { ArticleList } from "@/components/article/article-list";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminArticlesPage() {
  return (
    <div className="space-y-8">
      <div className="py-8 px-6 -mx-6 mb-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <PageHeader
            title="Manage Articles"
            description="Create, edit, and manage your articles"
          />
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/articles/new">
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Link>
          </Button>
        </div>
      </div>
      <ArticleList isAdmin={true} />
    </div>
  );
}
