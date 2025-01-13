"use client";
import { useEffect } from "react";
import { loader } from "@monaco-editor/react";
import { ThemeProvider, BaseStyles } from '@primer/react'
import { queryClient, rootStore, RootStoreContext } from "./stores";
import { InputTextDialog } from "./components/dialogs/input-text-dialog";
import { ConfirmationDialog } from "./components/dialogs/confirmation-dialog";
import { QueryClientProvider } from "@tanstack/react-query";
import ThemeRegistry from "./ThemeRegistry";
import { AboutDialog } from "./components/dialogs/about-dialog";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    if (typeof window !== undefined) {
      (window as any).rootStore = rootStore;
    }
    import('monaco-editor')
      .then((monaco) =>
        loader.config({ monaco }));
  });

  return (<RootStoreContext.Provider value={rootStore}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider colorMode="auto" preventSSRMismatch>
        {children}
      </ThemeProvider>
      <ThemeRegistry>
        <InputTextDialog />
        <ConfirmationDialog />
        <AboutDialog />
      </ThemeRegistry>
    </QueryClientProvider>
  </RootStoreContext.Provider>
  );
}
