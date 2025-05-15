"use client";

import { useState, useEffect } from "react";
import { ArticleDetail } from "@/components/article/article-detail";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { articleService } from "@/services";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface ArticleDetailPageProps {
  params: {
    id: string;
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Add effect to ensure article data is available
  useEffect(() => {
    const verifyArticleExists = async () => {
      // First check if the article exists in localStorage
      if (typeof window !== "undefined") {
        // Try direct article retrieval
        const directArticle = articleService.directGetArticle(id);

        if (!directArticle) {
          console.log(
            "Article not found in localStorage, trying service.getArticle"
          );
          // If not found, try to fetch it
          try {
            const response = await articleService.getArticle(id);
            console.log("Article fetch response:", response);

            // Force a refresh to show the article
            if (response.status && response.data) {
              setRefreshKey((prev) => prev + 1);
            }
          } catch (error) {
            console.error("Error fetching article:", error);
            toast({
              title: "Error",
              description:
                "Could not load the article. It may have been deleted.",
              variant: "destructive",
            });
          }
        }
      }
    };

    verifyArticleExists();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }

    setIsDeleting(true);
    try {
      // First try direct deletion from localStorage (more reliable in demo mode)
      if (typeof window !== "undefined") {
        const directDeleteSuccess = articleService.directDeleteArticle(id);

        if (directDeleteSuccess) {
          toast({
            title: "Success",
            description: "Article deleted successfully",
          });

          // Force a small delay to ensure localStorage updates are processed
          setTimeout(() => {
            router.push("/admin/articles");
          }, 300);

          return;
        }
      }

      // If direct delete fails or we're not in demo mode, try the API
      const response = await articleService.deleteArticle(id);

      if (response.status) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        });
        router.push("/admin/articles");
      } else {
        throw new Error("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);

      // Traditional fallback method if direct delete and API both fail
      if (typeof window !== "undefined") {
        try {
          const storedArticles = localStorage.getItem("dummyArticles");
          if (storedArticles) {
            const articles = JSON.parse(storedArticles);
            // Count articles before filtering
            const countBefore = articles.length;

            // Filter out the article to delete
            const updatedArticles = articles.filter(
              (article: { id: string }) => article.id !== id
            );

            // Verify that an article was actually removed
            if (countBefore > updatedArticles.length) {
              // Save back to localStorage
              localStorage.setItem(
                "dummyArticles",
                JSON.stringify(updatedArticles)
              );
              localStorage.setItem("articleDeletedAt", Date.now().toString());

              toast({
                title: "Success",
                description: "Article deleted successfully",
              });

              router.push("/admin/articles");
              return;
            } else {
              throw new Error("Article not found for deletion");
            }
          }
        } catch (e) {
          console.error("Error with localStorage deletion:", e);
        }
      }

      toast({
        title: "Error",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Article Details"
        description="View the complete article"
        action={
          <div className="flex gap-2">
            <Link href={`/admin/articles/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="size-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="size-4 mr-1" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        }
      />
      <ArticleDetail key={refreshKey} articleId={id} isAdmin={true} />
    </div>
  );
}
