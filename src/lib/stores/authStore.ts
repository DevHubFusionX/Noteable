import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "@/lib/api/auth";
import { User, LoginPayload, RegisterPayload } from "@/lib/api/types";
import { ApiClientError } from "@/lib/api/client";
import { TOKEN_KEYS } from "@/lib/constants";

interface AuthState {
  user:            User | null;
  accessToken:     string | null;
  refreshToken:    string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  error:           string | null;

  login:      (payload: LoginPayload)    => Promise<void>;
  register:   (payload: RegisterPayload) => Promise<void>;
  logout:     ()                         => Promise<void>;
  fetchMe:    ()                         => Promise<void>;
  updateMe:   (payload: Partial<Pick<User, "name" | "email">>) => Promise<void>;
  clearError: ()                         => void;
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean)         => void;
}

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEYS.access,  accessToken);
  localStorage.setItem(TOKEN_KEYS.refresh, refreshToken);
  // Set cookie so middleware can read it on the next server request
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${TOKEN_KEYS.access}=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.access);
  localStorage.removeItem(TOKEN_KEYS.refresh);
  // Expire the cookie
  document.cookie = `${TOKEN_KEYS.access}=; path=/; max-age=0; SameSite=Strict`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:            null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,
      _hasHydrated:    false,
      setHasHydrated: (val) => set({ _hasHydrated: val }),

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { user, accessToken, refreshToken } = await authApi.login(payload);
          saveTokens(accessToken, refreshToken);
          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const msg = err instanceof ApiClientError ? err.message : "Login failed";
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { user, accessToken, refreshToken } = await authApi.register(payload);
          saveTokens(accessToken, refreshToken);
          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const msg = err instanceof ApiClientError ? err.message : "Registration failed";
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch { /* ignore — clear locally regardless */ }
        clearTokens();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, error: null });
      },

      fetchMe: async () => {
        // Check state first, then localStorage (handles rehydration delay)
        const token = get().accessToken || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEYS.access) : null);
        if (!token) return;

        set({ isLoading: true });
        try {
          // Ensure token is in state for the api client interceptor
          if (!get().accessToken) set({ accessToken: token });
          
          const user = await authApi.getMe();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          clearTokens();
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateMe: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.updateMe(payload);
          set({ user, isLoading: false });
        } catch (err) {
          const msg = err instanceof ApiClientError ? err.message : "Update failed";
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name:    "noteable-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // Only persist tokens — user is re-fetched on mount
      partialize: (state) => ({
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

// Auto-logout on 401 from API client
if (typeof window !== "undefined") {
  window.addEventListener("noteable:unauthorized", () => {
    useAuthStore.getState().logout();
  });
}
