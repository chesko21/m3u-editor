"use client";

import { useState, useEffect } from "react";
import { getInitialTheme, setTheme, Theme, setupThemeListener } from "../lib/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getInitialTheme());
    setMounted(true);
    
    // Dengarkan perubahan skema warna jika user mengubah mode sistem operasi mereka
    const cleanup = setupThemeListener();
    return cleanup;
  }, []);

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  // Gunakan struktur transparan yang identik saat pra-render (SSR/Hydration) untuk mencegah layout shift
  if (!mounted) {
    return (
      <button
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-transparent"
        aria-label="Loading theme toggle"
        disabled
      >
        <div className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 active:scale-95 transition-all duration-200"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        <FontAwesomeIcon
          icon={theme === "dark" ? faSun : faMoon}
          className={`text-sm transition-all duration-300 absolute ${
            theme === "dark" 
              ? "text-amber-500 rotate-0 scale-100" 
              : "text-slate-400 dark:text-slate-400 -rotate-12 scale-100"
          }`}
        />
      </div>
    </button>
  );
}