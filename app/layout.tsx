import type { Metadata } from "next";
import "./globals.css";
import Menu from "./Menu";
import { getInitialTheme } from "../lib/theme";

export const metadata: Metadata = {
  title: "IPTV Editor - Edit and Manage M3U Playlists Easily",
  description: "IPTV Editor is a powerful tool to edit, manage, and organize your M3U playlists. Perfect for IPTV enthusiasts and professionals.",
  keywords: [
    "IPTV Editor",
    "M3U Playlist Editor",
    "IPTV Playlist Manager",
    "M3U File Editor",
    "IPTV Tools",
    "Edit M3U Files",
  ],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  openGraph: {
    title: "IPTV Editor - Edit and Manage M3U Playlists Easily",
    description: "IPTV Editor is a powerful tool to edit, manage, and organize your M3U playlists. Perfect for IPTV enthusiasts and professionals.",
    url: "https://yourwebsite.com",
    siteName: "IPTV Editor",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg", // Replace with your Open Graph image URL
        width: 1200,
        height: 630,
        alt: "IPTV Editor - Edit and Manage M3U Playlists",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPTV Editor - Edit and Manage M3U Playlists Easily",
    description: "IPTV Editor is a powerful tool to edit, manage, and organize your M3U playlists. Perfect for IPTV enthusiasts and professionals.",
    images: ["https://yourwebsite.com/twitter-image.jpg"], // Replace with your Twitter image URL
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://yourwebsite.com", // Replace with your canonical URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${getInitialTheme()}`}>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col antialiased">
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">IPTV Editor</h1>
            <Menu />
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-6 flex-grow">{children}</main>
        <footer className="bg-white dark:bg-gray-800 shadow-md mt-6">
          <div className="container mx-auto p-4 text-center text-sm text-gray-600 dark:text-gray-300">
            © 2023 IPTV Editor. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}