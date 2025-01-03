import type { Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";
import 'split-pane-react/esm/themes/default.css';
import 'dockview-react/dist/styles/dockview.css';
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
