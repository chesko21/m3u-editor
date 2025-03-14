import type { Metadata } from "next";
import "./globals.css";
import Menu from "./Menu";
import { getInitialTheme } from "../lib/theme";

export const metadata: Metadata = {
  title: "M3U Editor - Edit and Manage M3U Playlists Easily",
  description: "M3U Editor is a powerful tool to edit, manage, and organize your M3U playlists. Perfect for IPTV enthusiasts and professionals.",
  keywords: [
    "M3U Editor",
    "M3U Playlist Editor",
    "IPTV Playlist Manager",
    "M3U File Editor",
    "IPTV Tools",
    "Edit M3U Files",
  ],
  authors: [{ name: "m3u Editor", url: "https://m3u-editor-eta.vercel.app" }],
  openGraph: {
    title: "M3U Editor - Edit and Manage M3U Playlists Easily",
    description: "M3U Editor is a powerful tool to edit, manage, and organize your M3U playlists. Perfect for IPTV enthusiasts and professionals.",
    url: "https://m3u-editor-eta.vercel.app",
    siteName: "M3U Editor",
    images: [
      {
        url: "https://github.com/chesko21/smart_tv/blob/master/assets/images/maskable.png",
        width: 1200,
        height: 630,
        alt: "M3U Editor - Edit and Manage M3U Playlists",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "M3U Editor - Edit and Manage M3U Playlists Easily",
    description: "M3U Editor is a powerful tool to edit, manage, and organize your M3U playlists. Perfect for IPTV enthusiasts and professionals.",
    images: ["https://github.com/chesko21/smart_tv/blob/master/assets/images/maskable.png"], 
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
    canonical: "https://m3u-editor-eta.vercel.app", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={getInitialTheme()}>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col antialiased">
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">M3U Editor</h1>
            <Menu />
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-6 flex-grow">{children}</main>
      </body>
    </html>
  );
}