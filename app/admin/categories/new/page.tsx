import { CategoryForm } from "@/components/category/category-form";
import { PageHeader } from "@/components/page-header";

export default function AdminNewCategoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Category"
        description="Create a new category for your articles"
      />
      <CategoryForm />
    </div>
  );
}
