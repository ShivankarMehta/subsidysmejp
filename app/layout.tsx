import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japan SME Subsidies Admin",
  description: "Admin dashboard for Japanese SME subsidies and employer grants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
