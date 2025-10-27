import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SURL - URL Shortener",
  description: "A simple and efficient URL shortening service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
