"use client";
import { queryClient } from "./stores";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryClientProvider client={queryClient}>
      <Provider>
        {children}
      </Provider>
  </QueryClientProvider>;
}
