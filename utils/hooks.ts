"use client";

import { useState, useEffect, useCallback } from "react";

// Hook for debouncing values (such as search input)
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for handling async operations with loading, error, and success states
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  // The execute function wraps asyncFunction and
  // handles setting status and result values
  const execute = useCallback(() => {
    setStatus("pending");
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus("success");
        return response;
      })
      .catch((error) => {
        setError(error);
        setStatus("error");
        throw error;
      });
  }, [asyncFunction]);

  // Call execute if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error, isLoading: status === "pending" };
}

// Hook to get query params from URL
export function useQueryParams<T extends Record<string, string>>(): T {
  const [queryParams, setQueryParams] = useState<T>({} as T);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paramsObject: Record<string, string> = {};

      params.forEach((value, key) => {
        paramsObject[key] = value;
      });

      setQueryParams(paramsObject as T);
    }
  }, []);

  return queryParams;
}
