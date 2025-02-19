"use client";
import { ThemeProvider } from '@primer/react'
import { queryClient } from "./stores";
import { QueryClientProvider } from "@tanstack/react-query";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryClientProvider client={queryClient}>
    <ThemeProvider colorMode="auto" preventSSRMismatch>
      {children}
    </ThemeProvider>
  </QueryClientProvider>;
}
