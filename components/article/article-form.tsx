"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Article, Category } from "@/types";
import { articleService, categoryService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { dummyCategories } from "@/utils";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/utils";
import { Badge } from "@/components/ui/badge";

const articleSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100),
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters" }),
  categoryId: z.string({ required_error: "Please select a category" }),
});

type ArticleValues = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  article?: Article;
  isEditing?: boolean;
}

export function ArticleForm({ article, isEditing = false }: ArticleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<ArticleValues | null>(null);

  // Form
  const form = useForm<ArticleValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      content: article?.content || "",
      categoryId: article?.categoryId || "",
    },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories({ limit: 100 });

        if (response.status) {
          setCategories(response.data.items);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to dummy categories
        setCategories(dummyCategories);

        toast({
          title: "Warning",
          description: "Using demo categories. Server connection failed.",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, [toast]);

  // Handle form submission
  const onSubmit = async (values: ArticleValues) => {
    setIsLoading(true);

    try {
      if (isEditing && article) {
        // Update existing article
        const response = await articleService.updateArticle(article.id, values);

        if (response.status) {
          toast({
            title: "Success",
            description: "Article updated successfully",
          });
          router.push("/admin/articles");
        } else {
          throw new Error("Failed to update article");
        }
      } else {
        // Create new article
        const response = await articleService.createArticle(values);

        if (response.status) {
          toast({
            title: "Success",
            description: "Article created successfully",
          });
          router.push("/admin/articles");
        } else {
          throw new Error("Failed to create article");
        }
      }
    } catch (error) {
      console.error("Error submitting article form:", error);

      // Fallback for demo mode
      if (isEditing && article) {
        // Get the selected category with complete category object
        const selectedCategory = categories.find(
          (c) => c.id === values.categoryId
        );

        // Prepare complete article data
        const updatedData = {
          title: values.title,
          content: values.content,
          categoryId: values.categoryId,
          category: selectedCategory || article.category,
        };

        // Use direct update method (more reliable than manipulating localStorage directly)
        const updateSuccess = articleService.directUpdateArticle(
          article.id,
          updatedData
        );

        if (updateSuccess) {
          toast({
            title: "Success",
            description: "Article updated in demo mode",
          });

          // Redirect to article detail page
          router.push(`/admin/articles/${article.id}`);
          return;
        }

        // Fallback to traditional localStorage update if direct method fails
        const dummyArticles = JSON.parse(
          localStorage.getItem("dummyArticles") || "[]"
        );

        // If localStorage has no articles, use the one passed to the form
        if (dummyArticles.length === 0 && article) {
          // Replace the empty array with the current article
          localStorage.setItem("dummyArticles", JSON.stringify([article]));
        }

        // Find and update the article
        const updatedArticles = dummyArticles.map((a: Article) => {
          if (a.id === article.id) {
            return {
              ...a,
              ...updatedData
            };
          }
          return a;
        });

        // Save back to localStorage
        localStorage.setItem("dummyArticles", JSON.stringify(updatedArticles));
        localStorage.setItem("lastArticleUpdate", Date.now().toString());

        toast({
          title: "Success",
          description: "Article updated in demo mode",
        });

        // Redirect to article detail page
        router.push(`/admin/articles/${article.id}`);
        return;
      } else {
        // Handle article creation in demo mode
        const selectedCategory = categories.find(
          (c) => c.id === values.categoryId
        );

        const newArticle = {
          id: `demo-${Date.now()}`,
          title: values.title,
          content: values.content,
          categoryId: values.categoryId,
          category: selectedCategory,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const dummyArticles = JSON.parse(
          localStorage.getItem("dummyArticles") || "[]"
        );
        const updatedArticles = [...dummyArticles, newArticle];
        localStorage.setItem("dummyArticles", JSON.stringify(updatedArticles));

        toast({
          title: "Success",
          description: "Article created in demo mode",
        });

        router.push("/admin/articles");
        return;
      }

      toast({
        title: "Error",
        description: isEditing
          ? "Failed to update article. Please try again."
          : "Failed to create article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    const values = form.getValues();
    setPreviewData(values);
    setShowPreview(true);
  };

  // Get category name from ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div className="space-y-8">
      {showPreview ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <CardTitle className="text-2xl">{previewData?.title}</CardTitle>
                {previewData?.categoryId && (
                  <Badge variant="outline">
                    {getCategoryName(previewData.categoryId)}
                  </Badge>
                )}
              </div>
              <CardDescription>
                Preview - {formatDate(new Date().toISOString())}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {previewData?.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to Edit
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading && <LoadingSpinner size="small" className="mr-2" />}
              {isEditing ? "Update" : "Publish"} Article
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter article title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter article content"
                      className="min-h-[300px]"
                      {...field}
                    />
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
              <Button
                type="button"
                variant="secondary"
                onClick={handlePreview}
                disabled={!form.formState.isValid || isLoading}
              >
                Preview
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading && <LoadingSpinner size="small" className="mr-2" />}
                {isEditing ? "Update" : "Create"} Article
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
