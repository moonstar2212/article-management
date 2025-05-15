import { ApiResponse, Article, PaginatedResponse } from "@/types";
import { api } from "./api";
import { dummyArticles as defaultDummyArticles } from "@/utils";

// Function to ensure localStorage has articles data
const ensureLocalStorageArticles = () => {
  if (typeof window === "undefined") return false;

  try {
    const storedArticles = localStorage.getItem("dummyArticles");

    // If no articles in localStorage or it's invalid, initialize with default data
    if (!storedArticles) {
      console.log("Initializing localStorage with default articles");
      localStorage.setItem(
        "dummyArticles",
        JSON.stringify(defaultDummyArticles)
      );
      return true;
    }

    // Verify what we have is valid
    try {
      const parsed = JSON.parse(storedArticles);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.log(
          "Invalid or empty articles data in localStorage, resetting"
        );
        localStorage.setItem(
          "dummyArticles",
          JSON.stringify(defaultDummyArticles)
        );
        return true;
      }
    } catch (e) {
      console.error("Invalid JSON in localStorage, resetting articles");
      localStorage.setItem(
        "dummyArticles",
        JSON.stringify(defaultDummyArticles)
      );
      return true;
    }

    return false;
  } catch (e) {
    console.error("Error accessing localStorage:", e);
    return false;
  }
};

const getDummyArticles = () => {
  if (typeof window === "undefined") return defaultDummyArticles;

  try {
    // First ensure we have valid data in localStorage
    ensureLocalStorageArticles();

    // Add timestamp to force fresh read, bypassing any potential caching
    const timestamp = new Date().getTime();
    const storedArticles = localStorage.getItem("dummyArticles");

    // Verify we have valid data
    if (storedArticles) {
      try {
        const parsedData = JSON.parse(storedArticles);
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      } catch (parseError) {
        console.error("Error parsing stored articles", parseError);
      }
    }

    // Fallback to default
    return defaultDummyArticles;
  } catch (e) {
    console.error("Error getting dummy articles", e);
    return defaultDummyArticles;
  }
};

// Add a function to directly get a single article from localStorage
const directGetArticle = (id: string): Article | null => {
  if (typeof window === "undefined") return null;

  try {
    // Ensure localStorage has articles
    ensureLocalStorageArticles();

    // Force fresh read from localStorage
    const timestamp = new Date().getTime();
    const storedArticlesStr = localStorage.getItem("dummyArticles");

    if (!storedArticlesStr) {
      console.log("No articles found in localStorage");
      // Try fallback to default articles
      const defaultArticle = defaultDummyArticles.find((a) => a.id === id);
      return defaultArticle || null;
    }

    try {
      const storedArticles = JSON.parse(storedArticlesStr);

      if (!Array.isArray(storedArticles)) {
        console.error("localStorage contains invalid data format");
        return null;
      }

      const article = storedArticles.find((a: Article) => a.id === id);
      console.log(`Article ${id} found:`, article ? "Yes" : "No");
      return article || null;
    } catch (parseError) {
      console.error("Error parsing localStorage articles:", parseError);
      return null;
    }
  } catch (error) {
    console.error("Error directly retrieving article:", error);
    return null;
  }
};

// Add a function to directly update localStorage
const forceUpdateLocalArticle = (
  id: string,
  updatedArticle: Partial<Article>
) => {
  if (typeof window === "undefined") return false;

  try {
    // Ensure localStorage has articles
    ensureLocalStorageArticles();

    const storedArticles = getDummyArticles();
    const articleIndex = storedArticles.findIndex((a: Article) => a.id === id);

    if (articleIndex !== -1) {
      // Update the article with new data
      storedArticles[articleIndex] = {
        ...storedArticles[articleIndex],
        ...updatedArticle,
        updatedAt: new Date().toISOString(),
      };

      // Save back to localStorage
      localStorage.setItem("dummyArticles", JSON.stringify(storedArticles));
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error updating article in localStorage", e);
    return false;
  }
};

// Add a direct method for deleting an article in localStorage
const directDeleteArticle = (id: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    // Ensure localStorage has articles
    ensureLocalStorageArticles();

    // Force a fresh read from localStorage
    const timestamp = Date.now();
    const storedArticlesStr = localStorage.getItem("dummyArticles");

    if (!storedArticlesStr) return false;

    const storedArticles = JSON.parse(storedArticlesStr);

    // Check if the article exists
    const articleExists = storedArticles.some((a: Article) => a.id === id);
    if (!articleExists) return false;

    // Filter out the article to delete
    const filteredArticles = storedArticles.filter((a: Article) => a.id !== id);

    // Save back to localStorage
    localStorage.setItem("dummyArticles", JSON.stringify(filteredArticles));

    // Set a flag to indicate a change
    localStorage.setItem("articleDeletedAt", timestamp.toString());

    return true;
  } catch (error) {
    console.error("Error directly deleting article:", error);
    return false;
  }
};

export const articleService = {
  getArticles: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }) => {
    try {
      // Ensure localStorage has articles
      if (typeof window !== "undefined") {
        ensureLocalStorageArticles();
      }

      const response = await api.get<PaginatedResponse<Article>>("/articles", {
        params,
      });
      return response;
    } catch (error) {
      // Fallback to localStorage in demo mode
      if (typeof window !== "undefined") {
        const storedArticles = getDummyArticles();
        let filteredArticles = [...storedArticles];

        // Apply filters if provided
        if (params) {
          if (params.search) {
            const searchLower = params.search.toLowerCase();
            filteredArticles = filteredArticles.filter(
              (article) =>
                article.title.toLowerCase().includes(searchLower) ||
                article.content.toLowerCase().includes(searchLower)
            );
          }

          if (params.categoryId && params.categoryId !== "all") {
            filteredArticles = filteredArticles.filter(
              (article) => article.categoryId === params.categoryId
            );
          }

          // Calculate pagination
          const page = params.page || 1;
          const limit = params.limit || 10;
          const start = (page - 1) * limit;
          const end = start + limit;

          const paginatedArticles = filteredArticles.slice(start, end);

          return {
            status: true,
            data: {
              items: paginatedArticles,
              totalItems: filteredArticles.length,
              totalPages: Math.ceil(filteredArticles.length / limit),
              currentPage: page,
            },
            message: "Articles found in local storage",
          };
        }
      }

      throw error;
    }
  },

  getArticle: async (id: string) => {
    try {
      // Ensure localStorage has articles
      if (typeof window !== "undefined") {
        ensureLocalStorageArticles();
      }

      const response = await api.get<ApiResponse<Article>>(`/articles/${id}`);

      // Check localStorage first for demo mode
      if (typeof window !== "undefined") {
        // Get fresh data from localStorage every time
        const storedArticles = getDummyArticles();
        // Force fresh fetch from localStorage
        const localArticle = storedArticles.find((a: Article) => a.id === id);

        if (localArticle && (!response || !response.status)) {
          return {
            status: true,
            data: localArticle,
            message: "Article found in local storage",
          };
        }
      }

      return response;
    } catch (error) {
      // In case of error, try to get from localStorage
      if (typeof window !== "undefined") {
        // Get fresh data from localStorage
        const storedArticles = getDummyArticles();
        const localArticle = storedArticles.find((a: Article) => a.id === id);

        if (localArticle) {
          return {
            status: true,
            data: localArticle,
            message: "Article found in local storage",
          };
        }
      }

      throw error;
    }
  },

  createArticle: async (
    article: Omit<Article, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await api.post<ApiResponse<Article>>(
        "/articles",
        article
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateArticle: async (id: string, article: Partial<Article>) => {
    // First update localStorage directly to ensure local data is up to date
    if (typeof window !== "undefined") {
      forceUpdateLocalArticle(id, article);
    }

    try {
      const response = await api.put<ApiResponse<Article>>(
        `/articles/${id}`,
        article
      );
      return response;
    } catch (error) {
      // If API fails, we already updated localStorage, so return success
      if (typeof window !== "undefined") {
        return {
          status: true,
          data: { id, ...article } as Article,
          message: "Article updated in local storage",
        };
      }
      throw error;
    }
  },

  deleteArticle: async (id: string) => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/articles/${id}`);
      return response;
    } catch (error) {
      // Fallback to localStorage in demo mode
      if (typeof window !== "undefined") {
        const storedArticles = getDummyArticles();

        // Filter out the article to delete
        const updatedArticles = storedArticles.filter(
          (article) => article.id !== id
        );

        // Save back to localStorage
        localStorage.setItem("dummyArticles", JSON.stringify(updatedArticles));

        return {
          status: true,
          data: null,
          message: "Article deleted in local storage",
        };
      }

      throw error;
    }
  },

  getRelatedArticles: async (
    categoryId: string,
    articleId: string,
    limit: number = 3
  ) => {
    try {
      const response = await api.get<PaginatedResponse<Article>>("/articles", {
        params: {
          categoryId,
          limit,
          exclude: articleId,
        },
      });
      return response;
    } catch (error) {
      // Fallback to localStorage in demo mode
      if (typeof window !== "undefined") {
        const storedArticles = getDummyArticles();

        // Filter articles by category and exclude current article
        const relatedArticles = storedArticles
          .filter(
            (article) =>
              article.categoryId === categoryId && article.id !== articleId
          )
          .slice(0, limit);

        return {
          status: true,
          data: {
            items: relatedArticles,
            totalItems: relatedArticles.length,
            totalPages: 1,
            currentPage: 1,
          },
          message: "Related articles found in local storage",
        };
      }

      throw error;
    }
  },

  // Add a direct method for local storage updates
  directUpdateArticle: (id: string, articleData: Partial<Article>) => {
    if (typeof window === "undefined") return false;

    try {
      // Ensure localStorage has articles
      ensureLocalStorageArticles();

      const storedArticles = localStorage.getItem("dummyArticles");
      if (!storedArticles) return false;

      const articles = JSON.parse(storedArticles);
      const articleIndex = articles.findIndex((a: Article) => a.id === id);

      if (articleIndex === -1) return false;

      // Update the article with complete data
      articles[articleIndex] = {
        ...articles[articleIndex],
        ...articleData,
        updatedAt: new Date().toISOString(),
      };

      // Save back to localStorage
      localStorage.setItem("dummyArticles", JSON.stringify(articles));

      // Set a refresh flag
      localStorage.setItem("articleLastUpdated", Date.now().toString());

      return true;
    } catch (error) {
      console.error("Error directly updating article", error);
      return false;
    }
  },

  // Function to reset localStorage to default articles
  resetArticlesToDefault: () => {
    if (typeof window === "undefined") return false;

    try {
      localStorage.setItem(
        "dummyArticles",
        JSON.stringify(defaultDummyArticles)
      );
      return true;
    } catch (error) {
      console.error("Error resetting articles to default:", error);
      return false;
    }
  },

  // Add a direct method to get a single article
  directGetArticle,

  // Add a direct delete method
  directDeleteArticle,

  // Export the ensure function so components can call it directly
  ensureLocalStorageArticles,
};
