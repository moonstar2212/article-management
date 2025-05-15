import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { categoryService } from "@/services";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";

// Form schema
const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters" })
    .max(50),
});

type CategoryValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  isEditing?: boolean;
}

export function CategoryForm({
  category,
  isEditing = false,
}: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: CategoryValues) => {
    setIsLoading(true);

    try {
      if (isEditing && category) {
        // Update existing category
        const response = await categoryService.updateCategory(
          category.id,
          values
        );

        if (response.status) {
          toast({
            title: "Success",
            description: "Category updated successfully",
          });
          router.push("/admin/categories");
        } else {
          throw new Error("Failed to update category");
        }
      } else {
        // Create new category
        const response = await categoryService.createCategory(values);

        if (response.status) {
          toast({
            title: "Success",
            description: "Category created successfully",
          });
          router.push("/admin/categories");
        } else {
          throw new Error("Failed to create category");
        }
      }
    } catch (error) {
      console.error("Error submitting category form:", error);

      toast({
        title: "Error",
        description: isEditing
          ? "Failed to update category. Please try again."
          : "Failed to create category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <LoadingSpinner size="small" className="mr-2" />}
            {isEditing ? "Update" : "Create"} Category
          </Button>
        </div>
      </form>
    </Form>
  );
}
