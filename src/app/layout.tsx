import type { Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";
import '@fontsource/inter';
import 'split-pane-react/esm/themes/default.css';
import { ClientLayout } from "./client-layout";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Editor for ESPHome",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body
        className={`antialiased h-full`}
      >
        <NuqsAdapter>
          <ClientLayout>
            {children}
            <Toaster />
          </ClientLayout>
        </NuqsAdapter>
      </body>
    </html>
  );
}
