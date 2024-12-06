import type { Metadata } from "next";
import "./globals.css";
import 'split-pane-react/esm/themes/default.css';
import { ClientLayout } from "./client-layout";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ESPHome-Editor",
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
          <ClientLayout>
            {children}
            <Toaster />
          </ClientLayout>
      </body>
    </html>
  );
}
