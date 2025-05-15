import { ApiResponse, Category, PaginatedResponse } from "@/types";
import { api } from "./api";

export const categoryService = {
  getCategories: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      const response = await api.get<PaginatedResponse<Category>>(
        "/categories",
        { params }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCategory: async (id: string) => {
    try {
      const response = await api.get<ApiResponse<Category>>(
        `/categories/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  createCategory: async (
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await api.post<ApiResponse<Category>>(
        "/categories",
        category
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (id: string, category: Partial<Category>) => {
    try {
      const response = await api.put<ApiResponse<Category>>(
        `/categories/${id}`,
        category
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/categories/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
