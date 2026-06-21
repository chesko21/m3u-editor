export type Theme = "light" | "dark";

/**
 * Menerapkan tema aktif ke DOM root elemen (<html>) dan menyimpannya di localStorage.
 */
export function setTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Menangani batasan penyimpanan (misalnya mode penjelajahan pribadi / private browsing)
    console.warn("Storage access denied: unable to save theme preference.", error);
  }

  const root = document.documentElement;
  
  // Menggunakan manipulasi classList modern demi performa rendering yang lebih cepat
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

/**
 * Mengambil preferensi tema awal berdasarkan localStorage atau preferensi sistem operasi user.
 */
export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
  } catch {
    // Fallback jika localStorage tidak dapat diakses
  }

  // Gunakan pencocokan media query bawaan sistem operasi
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Mengeksekusi inisialisasi awal penyesuaian tema aplikasi.
 */
export function applyInitialTheme() {
  setTheme(getInitialTheme());
}

/**
 * Membalikkan status tema aktif saat ini secara instan.
 */
export function toggleTheme(): Theme {
  const newTheme: Theme = getInitialTheme() === "dark" ? "light" : "dark";
  setTheme(newTheme);
  return newTheme;
}

/**
 * Menyiapkan event listener untuk memantau perubahan preferensi tema sistem operasi
 * DAN sinkronisasi antar-tab peramban secara real-time.
 */
export function setupThemeListener() {
  if (typeof window === "undefined") return;

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // 1. Penanganan perubahan preferensi di sisi sistem operasi (OS)
  const handleSystemChange = (e: MediaQueryListEvent | MediaQueryList) => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    } catch {
      // Fallback aman jika akses storage diblokir
    }
  };

  // 2. Penanganan sinkronisasi multi-tab (jika user mengubah tema di tab sebelah)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "theme" && (e.newValue === "dark" || e.newValue === "light")) {
      setTheme(e.newValue as Theme);
    }
  };

  // Daftarkan semua event listener pendukung
  mediaQuery.addEventListener("change", handleSystemChange);
  window.addEventListener("storage", handleStorageChange);

  // Kembalikan callback fungsi pembersih (cleanup) untuk mencegah kebocoran memori (memory leak)
  return () => {
    mediaQuery.removeEventListener("change", handleSystemChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

/**
 * Mengambil informasi murni status tema bawaan sistem operasi komputer/ponsel.
 */
export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}