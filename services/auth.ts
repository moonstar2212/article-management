import {
  ApiResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types";
import { api } from "./api";
import Cookies from "js-cookie";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<
        ApiResponse<{ user: User; token: string }>
      >("/auth/login", credentials);

      // Save token and user info to cookies
      if (response.status && response.data) {
        Cookies.set("token", response.data.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      const response = await api.post<
        ApiResponse<{ user: User; token: string }>
      >("/auth/register", credentials);

      // Save token and user info to cookies
      if (response.status && response.data) {
        Cookies.set("token", response.data.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    Cookies.remove("token");
    Cookies.remove("user");
  },

  getCurrentUser: (): User | null => {
    try {
      const userJson = Cookies.get("user");
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("Error parsing user from cookie:", error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get("token");
  },
};
