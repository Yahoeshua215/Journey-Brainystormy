import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journey Builder",
  description: "Create automated notification journeys for your users",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
