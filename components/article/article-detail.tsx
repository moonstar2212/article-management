"use client";

import { useEffect, useState } from "react";
import { Article } from "@/types";
import { formatDate } from "@/utils";
import { articleService } from "@/services";
import { ArticleCard } from "./article-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { dummyArticles } from "@/utils";
import { Calendar, User, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ArticleDetailProps {
  articleId: string;
  isAdmin?: boolean;
}

export function ArticleDetail({
  articleId,
  isAdmin = false,
}: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshArticle = () => {
    setIsLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  // Fetch article details
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setIsError(false);

      console.log("Fetching article with ID:", articleId);

      try {
        // First try direct article fetch from service
        if (typeof window !== "undefined") {
          console.log("Trying direct article retrieval from localStorage");
          const directArticle = articleService.directGetArticle(articleId);

          if (directArticle) {
            console.log(
              "Article found through directGetArticle:",
              directArticle
            );
            setArticle(directArticle);
            setIsLoading(false);
            return;
          } else {
            console.log("Direct article retrieval returned null");
          }
        }

        // If direct access fails, go through the service API
        console.log("Trying articleService.getArticle()");
        const response = await articleService.getArticle(articleId);
        console.log("Service response:", response);

        if (response.status && response.data) {
          console.log("Setting article from service response:", response.data);
          setArticle(response.data);
        } else {
          throw new Error("Failed to fetch article");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setIsError(true);

        // Final fallback to dummy data from imported constants
        console.log("Trying fallback to imported dummyArticles");
        const dummyArticle = dummyArticles.find((a) => a.id === articleId);
        if (dummyArticle) {
          console.log("Found article in imported dummy data");
          setArticle(dummyArticle);
        } else {
          console.log("Article not found in imported dummy data either");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, refreshKey]);

  // Fetch related articles
  useEffect(() => {
    if (article?.categoryId) {
      const fetchRelatedArticles = async () => {
        try {
          const response = await articleService.getRelatedArticles(
            article.categoryId,
            article.id,
            3
          );

          if (response.status) {
            setRelatedArticles(response.data.items);
          } else {
            throw new Error("Failed to fetch related articles");
          }
        } catch (error) {
          console.error("Error fetching related articles:", error);

          // Fallback to dummy related articles
          const dummyRelated = dummyArticles
            .filter(
              (a) => a.categoryId === article.categoryId && a.id !== article.id
            )
            .slice(0, 3);

          setRelatedArticles(dummyRelated);
        }
      };

      fetchRelatedArticles();
    }
  }, [article]);

  const backLink = isAdmin ? "/admin/articles" : "/user/articles";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-lg bg-background/30">
        <p className="text-muted-foreground">Article not found.</p>
        <Link
          href={backLink}
          className="mt-4 inline-block text-primary hover:text-accent transition-all"
        >
          <ArrowLeft className="inline mr-1" size={16} /> Back to articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero section */}
      <div className="relative py-12 px-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/40 shadow-sm">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href={backLink}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-all"
            >
              <ArrowLeft size={14} />
              <span>Back to articles</span>
            </Link>

            <button
              onClick={refreshArticle}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-all p-1 rounded-full hover:bg-primary/5"
              title="Refresh article"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <h1 className="text-3xl md:text-4xl font-bold">
                {article.title}
              </h1>
              {article.category && (
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {article.category.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-3xl mx-auto">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {article.content.split("\n").map((paragraph, index) => (
            <p key={index} className={index === 0 ? "text-lg font-medium" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="space-y-6 pt-8 border-t">
          <h2 className="text-2xl font-semibold">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.id}
                article={relatedArticle}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="text-center py-2 px-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded text-xs text-amber-600 dark:text-amber-400">
          <p>Unable to connect to the server. Showing demo data.</p>
        </div>
      )}
    </div>
  );
}
