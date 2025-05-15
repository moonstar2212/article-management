import { CategoryList } from "@/components/category/category-list";
import { PageHeader } from "@/components/page-header";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Manage article categories" />
      <CategoryList />
    </div>
  );
}
