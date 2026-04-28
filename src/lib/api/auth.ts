import { apiClient } from "./client";
import {
  AuthResponse, AuthResponseSchema,
  LoginPayload, RegisterPayload,
  User, UserSchema,
} from "./types";
import { TOKEN_KEYS } from "@/lib/constants";

export const authApi = {
  // POST /auth/sign-up  { name, email, password }
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post("/auth/sign-up", payload);
    return AuthResponseSchema.parse(data);
  },

  // POST /auth/login  { email, password }
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post("/auth/login", payload);
    return AuthResponseSchema.parse(data);
  },

  // POST /auth/logout  { accessToken, refreshToken }
  logout: async (): Promise<void> => {
    const accessToken  = localStorage.getItem(TOKEN_KEYS.access)  ?? "";
    const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh) ?? "";
    await apiClient.post("/auth/logout", { accessToken, refreshToken });
  },

  // GET /users/  — returns current user profile (requires Bearer token)
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get("/users/");
    return UserSchema.parse(data);
  },

  // PATCH /users/  — update current user profile
  updateMe: async (payload: Partial<Pick<User, "name" | "email">>): Promise<User> => {
    const { data } = await apiClient.patch("/users/", payload);
    return UserSchema.parse(data);
  },
};
