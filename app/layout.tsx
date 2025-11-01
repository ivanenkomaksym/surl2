import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URL Shortener - Create shorter URLs and track link analytics",
  description: "Create shorter URLs and track link analytics with real-time data. A simple and efficient URL shortening service with detailed analytics.",
  keywords: ["url shortener", "link shortener", "analytics", "link tracking", "short links"],
  authors: [{ name: "SURL" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
