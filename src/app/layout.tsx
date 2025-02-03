import type { Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";
import 'dockview-react/dist/styles/dockview.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ClientLayout } from "./client-layout";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "Editor for ESPHome",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`antialiased h-full`}
      >
        <MantineProvider defaultColorScheme="auto">
          <NuqsAdapter>
            <ClientLayout>
              <Notifications position="top-center" />
              <ModalsProvider modalProps={{centered: true}} >
                {children}
              </ModalsProvider>
            </ClientLayout>
          </NuqsAdapter>
        </MantineProvider>
      </body>
    </html>
  );
}
