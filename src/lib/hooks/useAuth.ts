import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/queryKeys";
import { useAuthStore } from "@/lib/stores/authStore";
import { useUiStore } from "@/lib/stores/uiStore";
import { LoginPayload, RegisterPayload } from "@/lib/api/types";

export const useMe = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn:  authApi.getMe,
    enabled:  !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

const useAuthMutation = <T>(mutationFn: (payload: T) => Promise<void>, successMessage: string) => {
  const { showToast } = useUiStore();
  const router = useRouter();
  const qc     = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
      showToast(successMessage, "success");
      router.push("/dashboard");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
};

export const useLogin = () => {
  const { login } = useAuthStore();
  return useAuthMutation<LoginPayload>(login, "Welcome back!");
};

export const useRegister = () => {
  const { register } = useAuthStore();
  return useAuthMutation<RegisterPayload>(register, "Account created! Welcome to Noteable.");
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const { showToast } = useUiStore();
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.clear();
      showToast("Signed out.", "info");
      router.push("/");
    },
  });
};
