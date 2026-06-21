import type { Metadata, Viewport } from "next";
import "./globals.css";
import Menu from "./Menu";
import SplashScreenWrapper from "../components/SplashScreenWrapper";

// 1. Perbaikan URL GitHub Blob ke Raw CDN agar gambar SEO/Favicon terbaca sempurna
const LOGO_RAW_URL = "https://raw.githubusercontent.com/chesko21/smart_tv/master/assets/images/maskable.png";
const SITE_URL = "https://m3u-editor-eta.vercel.app";

export const metadata: Metadata = {
  title: "M3U StreamEditor Pro - Edit & Manage IPTV Playlists Easily",
  description: "M3U StreamEditor Pro adalah alat berbasis web modern untuk mengedit, menyaring, dan mengelola daftar putar M3U/M3U8 IPTV Anda dengan performa tinggi.",
  keywords: [
    "M3U Editor",
    "M3U Playlist Editor",
    "IPTV Playlist Manager",
    "M3U File Editor",
    "IPTV Tools",
    "Edit M3U Files",
    "StreamEdit Pro"
  ],
  authors: [{ name: "M3U StreamEditor Pro", url: SITE_URL }],
  openGraph: {
    title: "M3U StreamEditor Pro - Edit & Manage IPTV Playlists Easily",
    description: "Alat berbasis web modern untuk mengedit, menyaring, dan mengelola daftar putar M3U/M3U8 IPTV Anda dengan performa tinggi.",
    url: SITE_URL,
    siteName: "M3U StreamEditor Pro",
    images: [
      {
        url: LOGO_RAW_URL,
        width: 512,
        height: 512,
        alt: "M3U StreamEditor Pro Logo Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "M3U StreamEditor Pro - Edit & Manage IPTV Playlists Easily",
    description: "Alat berbasis web modern untuk mengedit, menyaring, dan mengelola daftar putar M3U/M3U8 IPTV Anda dengan performa tinggi.",
    images: [LOGO_RAW_URL], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL, 
  },
  icons: {
    icon: LOGO_RAW_URL,
    shortcut: LOGO_RAW_URL,
    apple: LOGO_RAW_URL,
  },
};

// Next.js 14+ merekomendasikan pemisahan viewport dari objek metadata utama
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script yang dieksekusi secara instan untuk mencegah efek kilatan putih (flash) pada dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-[#0b0f19] min-h-screen flex flex-col antialiased text-gray-900 dark:text-gray-100 transition-colors duration-200 selection:bg-blue-500/20">
        {/* Splash screen pemuat awal aplikasi */}
        <SplashScreenWrapper />
        
        {/* Top Navigation Bar 
          Komponen Menu sudah mengisolasi navigasi, logo, judul aplikasi, dan dark mode switcher.
          Kita bungkus dengan pembungkus sticky agar layout di bawahnya dapat bergulir (scroll) dengan rapi.
        */}
        <header className="sticky top-0 z-50 w-full flex-shrink-0">
          <Menu />
        </header>

        {/* Main Content Canvas 
          Menggunakan tinggi kalkulasi 'h-[calc(100vh-4rem)]' (100vh dikurangi tinggi header 16 / 4rem) 
          untuk memastikan workspace page.tsx dapat membagi area sidebar kategori dan area card grid secara presisi tanpa double-scrollbar global.
        */}
        <main className="w-full flex-grow flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}