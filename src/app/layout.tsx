import type { Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";
import 'dockview-react/dist/styles/dockview.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ClientLayout } from "./client-layout";
import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "Editor for ESPHome",
};

const theme = createTheme({
  components: {
    "Tooltip": {
      defaultProps: {
        zIndex: 1000, //Dockview Floating Groups are 999
      }
    }
  }
});


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
        <MantineProvider defaultColorScheme="auto" theme={theme}>
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
