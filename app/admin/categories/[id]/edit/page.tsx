import { CategoryForm } from '@/components/category/category-form';
import { PageHeader } from '@/components/page-header';
import { categoryService } from '@/services';
import { dummyCategories } from '@/utils';

interface AdminEditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function AdminEditCategoryPage({ params }: AdminEditCategoryPageProps) {
  // Get category data
  let category;
  try {
    const response = await categoryService.getCategory(params.id);
    if (response.status) {
      category = response.data;
    } else {
      throw new Error('Failed to fetch category');
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    // Fallback to dummy data
    category = dummyCategories.find(c => c.id === params.id);
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Category" />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Category not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Category"
        description={`Editing: ${category.name}`}
      />
      <CategoryForm category={category} isEditing={true} />
    </div>
  );
} 