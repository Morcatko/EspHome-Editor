"use client";
import { ThemeProvider } from '@primer/react'
import { queryClient } from "./stores";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMonacoInit } from "./components/editors/monaco/next-init";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const monacoInitialized = useMonacoInit();

  return monacoInitialized
    ? (<QueryClientProvider client={queryClient}>
      <ThemeProvider colorMode="auto" preventSSRMismatch>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
    )
    : null;
}
