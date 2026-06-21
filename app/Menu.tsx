"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTv, 
  faInfoCircle, 
  faEnvelope, 
  faStar, 
  faBars, 
  faTimes,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "../components/ThemeToggle";


export default function Menu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efek UX: Mengubah style navbar saat pengguna melakukan scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mengunci scroll latar belakang saat menu mobile terbuka (Good UX Practice)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navigationItems = [
    { label: "Editor", href: "/", icon: faTv, desc: "Manage & filter playlist" },
    { label: "Features", href: "/features", icon: faStar, desc: "Explore what's new" },
    { label: "About", href: "/about", icon: faInfoCircle, desc: "Learn about StreamEdit" },
    { label: "Contact", href: "/contact", icon: faEnvelope, desc: "Get in touch with us" },
  ];

  return (
    <>
      {/* NAVBAR CONTAINER */}
      <nav 
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs border-b border-gray-100 dark:border-slate-800/50 h-14" 
            : "bg-white dark:bg-slate-900 border-b border-transparent h-16"
        }`}
      >
        <div className="max-w-[1920px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* SISI KIRI: BRANDING LOGO */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
              <FontAwesomeIcon icon={faTv} className="text-sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                Stream<span className="text-blue-600 dark:text-blue-500">Edit</span>
                <span className="ml-1.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/30">PRO</span>
              </span>
            </div>
          </Link>

          {/* SISI TENGAH: NAVIGASI DESKTOP */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-100 dark:border-slate-800/30">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-100 dark:border-slate-700/50"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className={`text-[13px] ${isActive ? "opacity-100" : "opacity-60"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* SISI KANAN: UTILITAS & MOBILE HAMBURGER */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
              aria-expanded={isOpen}
              aria-label="Toggle main navigation menu"
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <FontAwesomeIcon 
                  icon={isOpen ? faTimes : faBars} 
                  className={`text-sm transition-all duration-300 absolute ${isOpen ? "rotate-90 scale-100" : "rotate-0 scale-100"}`} 
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER (UX ENHANCEMENT: SIDE PANEL OVERLAY) */}
      <div 
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop overlay gelap hitam */}
        <div 
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />

        {/* Panel Konten Menu */}
        <div 
          className={`absolute top-0 right-0 w-[280px] sm:w-[320px] h-full bg-white dark:bg-slate-900 p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform border-l border-slate-100 dark:border-slate-800 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="space-y-6 pt-12">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Navigation</p>
              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-1" />
            </div>

            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                        <FontAwesomeIcon icon={item.icon} className="text-xs" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{item.label}</span>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">{item.desc}</span>
                      </div>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className={`text-[10px] opacity-40 transition-transform ${isActive ? "translate-x-0.5 text-blue-500" : ""}`} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bagian Bawah Panel Mobile */}
          <div className="space-y-4">
            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono px-1">
              <span>StreamEdit Pro</span>
              <span>v4.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}