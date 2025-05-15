"use client";

import { useState, useEffect } from "react";
import { Article, Category } from "@/types";
import { useDebounce } from "@/utils";
import { articleService, categoryService } from "@/services";
import { ArticleCard } from "./article-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomPagination } from "@/components/ui/pagination";
import { Search, RefreshCw, AlertTriangle } from "lucide-react";
import { dummyArticles, dummyCategories } from "@/utils";
import { Button } from "@/components/ui/button";

interface ArticleListProps {
  isAdmin?: boolean;
  itemsPerPage?: number;
}

export function ArticleList({
  isAdmin = false,
  itemsPerPage = isAdmin ? 10 : 9,
}: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isError, setIsError] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [isReset, setIsReset] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Initialize localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure localStorage has default articles
      const wasReset = articleService.ensureLocalStorageArticles();
      if (wasReset) {
        console.log("Articles were reset to defaults");
        setLastRefresh(Date.now());
      }
    }
  }, []);

  // Check localStorage for updates
  useEffect(() => {
    const checkForUpdates = () => {
      if (typeof window === "undefined") return;

      const lastDeletedAt = localStorage.getItem("articleDeletedAt");
      const lastUpdatedAt = localStorage.getItem("articleLastUpdated");

      if (lastDeletedAt || lastUpdatedAt) {
        // Force refresh if deletion or update happened
        setLastRefresh(Date.now());

        // Clear the flags after using them
        if (lastDeletedAt) localStorage.removeItem("articleDeletedAt");
        if (lastUpdatedAt) localStorage.removeItem("articleLastUpdated");
      }
    };

    // Check on mount and set interval
    checkForUpdates();

    // Check every 2 seconds in case of changes
    const interval = setInterval(checkForUpdates, 2000);

    return () => clearInterval(interval);
  }, []);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setIsError(false);
      setIsReset(false);

      try {
        const response = await articleService.getArticles({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchQuery,
          categoryId: selectedCategory || undefined,
        });

        if (response.status) {
          setArticles(response.data.items);
          setTotalPages(response.data.totalPages);
        } else {
          throw new Error("Failed to fetch articles");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setIsError(true);

        // Get fresh data directly from localStorage
        let localArticles = [];
        if (typeof window !== "undefined") {
          try {
            // Ensure we have valid data
            articleService.ensureLocalStorageArticles();

            const storedArticles = localStorage.getItem("dummyArticles");
            if (storedArticles) {
              localArticles = JSON.parse(storedArticles);
            } else {
              localArticles = dummyArticles;
            }
          } catch (e) {
            localArticles = dummyArticles;
          }
        } else {
          localArticles = dummyArticles;
        }

        // Fallback to dummy data
        const filteredArticles = localArticles.filter((article: Article) => {
          const matchesSearch = debouncedSearchQuery
            ? article.title
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase()) ||
              article.content
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase())
            : true;

          const matchesCategory = selectedCategory
            ? article.categoryId === selectedCategory
            : true;

          return matchesSearch && matchesCategory;
        });

        // Calculate pagination for dummy data
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedArticles = filteredArticles.slice(start, end);

        setArticles(paginatedArticles);
        setTotalPages(Math.ceil(filteredArticles.length / itemsPerPage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearchQuery,
    selectedCategory,
    lastRefresh,
  ]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        if (response.status) {
          setCategories(response.data.items);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to dummy categories
        setCategories(dummyCategories);
      }
    };

    fetchCategories();
  }, []);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Reset articles to default
  const handleResetArticles = () => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
      articleService.resetArticlesToDefault();
      setSearchQuery("");
      setSelectedCategory("");
      setCurrentPage(1);
      setLastRefresh(Date.now());
      setIsReset(true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-background/50 p-4 rounded-lg border border-border/50 shadow-sm backdrop-blur-sm">
        <div className="flex-1 relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-9 h-10 transition-all focus-visible:ring-primary/30 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Select
          value={selectedCategory || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-10">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isAdmin={isAdmin}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-lg bg-background/30 backdrop-blur-sm">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-6">
            No articles match your search criteria or all articles may have been
            deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setCurrentPage(1);
                setLastRefresh(Date.now());
              }}
              variant="outline"
              className="text-primary"
            >
              <RefreshCw className="size-4 mr-2" />
              Reset filters
            </Button>
            <Button
              onClick={handleResetArticles}
              variant="default"
              className="bg-primary hover:bg-primary/90"
            >
              Restore default articles
            </Button>
          </div>
        </div>
      )}

      {isReset && (
        <div className="text-center py-2 px-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded text-xs text-green-600 dark:text-green-400">
          <p>Articles have been reset to default successfully!</p>
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
 