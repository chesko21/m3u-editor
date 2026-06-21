"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Mengecek apakah app sudah diinstall
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handler = (e: Event) => {
      // Mencegah prompt bawaan muncul seketika
      e.preventDefault();
      // Menyimpan event sehingga bisa dipanggil nanti
      setDeferredPrompt(e);
      // Menampilkan custom popup kita
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Sembunyikan popup kita
    setIsVisible(false);

    // Tampilkan prompt bawaan browser
    deferredPrompt.prompt();

    // Tunggu pilihan user (opsional)
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Kita sudah memakai prompt ini, jadi tidak bisa dipakai lagi
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-[9999] transition-all duration-500 ease-out">
      <div className="bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 flex items-center gap-3 border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
        {/* Decorative highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-xl flex-shrink-0 shadow-lg shadow-blue-500/30">
          <Download className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-[15px] leading-tight font-extrabold text-gray-900 dark:text-white tracking-tight">
            Install App
          </h3>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-snug font-medium">
            Tambahkan M3U Editor ke Home Screen untuk akses lebih cepat!
          </p>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-lg transition-all shadow-md shadow-blue-600/20"
          >
            Install
          </button>
        </div>
        
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full transition-colors bg-transparent"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
