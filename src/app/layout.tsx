import type { Metadata } from "next";
import "./globals.css";
import 'flexlayout-react/style/light.css';  
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
