"use client";
import { queryClient } from "./stores";
import { QueryClientProvider } from "@tanstack/react-query";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>;
}
