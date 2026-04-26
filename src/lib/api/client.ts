import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { TOKEN_KEYS } from "@/lib/constants";

export class ApiClientError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

const createClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
    timeout: 30_000,
    headers: { "Content-Type": "application/json" },
  });

  // ── Request: inject accessToken ──
  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEYS.access);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ── Response: unwrap { error, message, data } and normalise errors ──
  client.interceptors.response.use(
    (res: AxiosResponse) => {
      // If the API returns { error: true, message, data }
      // treat it as an application-level error even on HTTP 200
      if (res.data?.error === true) {
        return Promise.reject(
          new ApiClientError(res.data.message ?? "Request failed", res.status),
        );
      }
      // Unwrap so callers get res.data.data directly via { data } destructure
      res.data = res.data?.data ?? res.data;
      return res;
    },
    (err: AxiosError<{ error?: boolean; message?: string; errors?: Record<string, string> }>) => {
      const status  = err.response?.status ?? 500;
      const message = err.response?.data?.message ?? err.message ?? "Something went wrong";
      const errors  = err.response?.data?.errors;

      if (status === 401 && typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEYS.access);
        localStorage.removeItem(TOKEN_KEYS.refresh);
        window.dispatchEvent(new CustomEvent("noteable:unauthorized"));
      }

      console.error(`API Error [${status}]:`, message, err.response?.data);
      return Promise.reject(new ApiClientError(message, status, errors));
    },
  );

  return client;
};

export const apiClient = createClient();
