"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/types";
import { useDebounce } from "@/utils";
import { categoryService } from "@/services";
import { LoadingSpinner } from "@/components/loading-spinner";
import { formatDate } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { CustomPagination } from "@/components/ui/pagination";
import { dummyCategories } from "@/utils";

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const itemsPerPage = 10;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await categoryService.getCategories({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchQuery,
        });

        if (response.status) {
          setCategories(response.data.items);
          setTotalPages(response.data.totalPages);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsError(true);
        // Fallback to dummy data
        const filteredCategories = dummyCategories.filter((category) =>
          debouncedSearchQuery
            ? category.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase())
            : true
        );

        // Calculate pagination
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedCategories = filteredCategories.slice(start, end);

        setCategories(paginatedCategories);
        setTotalPages(Math.ceil(filteredCategories.length / itemsPerPage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, debouncedSearchQuery]);

  // Handle delete category
  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await categoryService.deleteCategory(id);

      if (response.status) {
        // Remove category from the list
        setCategories(categories.filter((category) => category.id !== id));

        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);

      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : categories.length > 0 ? (
        <>
          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-2 p-4 bg-muted font-medium">
              <div className="col-span-5">Name</div>
              <div className="col-span-4">Created at</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="grid grid-cols-12 gap-2 p-4 items-center"
                >
                  <div className="col-span-5">{category.name}</div>
                  <div className="col-span-4 text-muted-foreground">
                    {formatDate(category.createdAt)}
                  </div>
                  <div className="col-span-3 flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      )}

      {isError && (
        <div className="text-center text-xs text-muted-foreground">
          <p>Unable to connect to the server. Showing demo data.</p>
        </div>
      )}
    </div>
  );
}
