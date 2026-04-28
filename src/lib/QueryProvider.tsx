"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:            5 * 60_000,
        gcTime:               10 * 60_000,
        retry:                1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });

// Ping the API on load to wake up Render free-tier cold start
const pingApi = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return;
  fetch(`${url}/health`, { method: "GET", cache: "no-store" }).catch(() => {});
};

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(makeQueryClient);

  useEffect(() => { pingApi(); }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
};
