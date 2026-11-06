import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const metadata: Metadata = {
  title: {
    default: "Vaulty",
    template: "%s | Vaulty",
  },
  description:
    "Vaulty is a premium workspace for passwords, notes, reminders, documents, emails, and memos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}