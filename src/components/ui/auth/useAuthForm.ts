"use client";

import { useState, useRef } from "react";
import { useLogin, useRegister } from "@/lib/hooks/useAuth";

export type AuthTab = "signup" | "login";

export const useAuthForm = () => {
  const [tab,      setTab]      = useState<AuthTab>("signup");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [done,     setDone]     = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const direction = useRef<1 | -1>(1);

  const loginMutation    = useLogin();
  const registerMutation = useRegister();

  const loading = loginMutation.isPending || registerMutation.isPending;
  const apiError = loginMutation.error?.message ?? registerMutation.error?.message ?? null;

  const switchTab = (t: AuthTab) => {
    direction.current = t === "login" ? 1 : -1;
    setTab(t);
    loginMutation.reset();
    registerMutation.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tab === "login") {
        await loginMutation.mutateAsync({ email, password });
      } else {
        await registerMutation.mutateAsync({ name, email, password });
      }
    } catch {
      // error shown via toast in mutation onError
    }
  };

  const reset = () => {
    setDone(false);
    setEmail("");
    setPassword("");
    setName("");
    loginMutation.reset();
    registerMutation.reset();
  };

  return {
    tab, email, setEmail,
    password, setPassword,
    name, setName,
    loading, done, forgotOpen, apiError,
    setForgotOpen, direction,
    switchTab, handleSubmit, reset,
  };
};
