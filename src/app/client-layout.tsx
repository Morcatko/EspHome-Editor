"use client";
import { useEffect } from "react";
import { loader } from "@monaco-editor/react";
import { ThemeProvider, BaseStyles } from '@primer/react'
import { rootStore, RootStoreContext } from "./stores";
import { InputTextDialog } from "./components/dialogs/input-text-dialog";
import { ConfirmationDialog } from "./components/dialogs/confirmation-dialog";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    if (typeof window !== undefined) {
      (window as any).rootStore = rootStore;
    }
    //Monaco editor based on https://github.com/graphql/graphiql/blob/main/examples/monaco-graphql-nextjs/next.config.js
    import('monaco-editor')
      .then((monaco) =>
        loader.config({ monaco }));
  });

  return (<RootStoreContext.Provider value={rootStore}>
    <ThemeProvider colorMode="auto" preventSSRMismatch>
      {children}
      <InputTextDialog />
      <ConfirmationDialog />
    </ThemeProvider>
  </RootStoreContext.Provider>
  );
}
