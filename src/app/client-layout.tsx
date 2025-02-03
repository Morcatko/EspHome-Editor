"use client";
import { useEffect } from "react";
import { loader } from "@monaco-editor/react";
import { ThemeProvider } from '@primer/react'
import { queryClient } from "./stores";
import { QueryClientProvider } from "@tanstack/react-query";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    import('monaco-editor')
      .then((monaco) =>
        loader.config({ monaco }));
  });

  return (<QueryClientProvider client={queryClient}>
      <ThemeProvider colorMode="auto" preventSSRMismatch>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
