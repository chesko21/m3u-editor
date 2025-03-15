/**
 * Sets the theme and saves it to localStorage.
 * @param theme - The theme to set (`light` or `dark`).
 */
export function setTheme(theme: "light" | "dark") {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
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

/**
 * Apply the theme on page load.
 */
export function applyInitialTheme() {
  const theme = getInitialTheme();
  setTheme(theme);
}
