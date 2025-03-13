// lib/theme.ts

/**
 * Sets the theme and saves it to localStorage.
 * @param theme - The theme to set (`light` or `dark`).
 */
export function setTheme(theme: "light" | "dark") {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}

/**
 * Gets the initial theme from localStorage or system preferences.
 * @returns The initial theme (`light` or `dark`).
 */
export function getInitialTheme(): "light" | "dark" {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDarkMode ? "dark" : "light";
  }
  return "light"; 
}