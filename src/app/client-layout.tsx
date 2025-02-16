"use client";
import { useEffect } from "react";
import { ThemeProvider } from '@primer/react'
import { queryClient } from "./stores";
import { QueryClientProvider } from "@tanstack/react-query";
import { nextMonacoInit } from "./components/editors/monaco/next-init";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => nextMonacoInit(), []);

  return (<QueryClientProvider client={queryClient}>
      <ThemeProvider colorMode="auto" preventSSRMismatch>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
