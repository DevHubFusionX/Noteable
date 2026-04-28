import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info" | "warning";
export type SidebarFlash = "trash" | "archive" | "pinned" | null;

export interface Toast {
  id:      string;
  message: string;
  variant: ToastVariant;
}

interface UiState {
  toasts:        Toast[];
  isPageLoading: boolean;
  sidebarFlash:  SidebarFlash;

  showToast:      (message: string, variant?: ToastVariant) => void;
  dismissToast:   (id: string) => void;
  setPageLoading: (v: boolean) => void;
  flashSidebar:   (icon: SidebarFlash) => void;
}

export const useUiStore = create<UiState>((set) => ({
  toasts:        [],
  isPageLoading: false,
  sidebarFlash:  null,

  showToast: (message, variant = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setPageLoading: (v) => set({ isPageLoading: v }),

  flashSidebar: (icon) => {
    set({ sidebarFlash: icon });
    setTimeout(() => set({ sidebarFlash: null }), 900);
  },
}));
