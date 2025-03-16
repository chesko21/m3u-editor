"use client";

import { useState, useEffect } from "react";
import { Menu as MenuIcon, X as CloseIcon, Sun, Moon } from "lucide-react";
import { setTheme, getInitialTheme } from "../lib/theme";
import { useRouter } from "next/navigation"; 

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setCurrentTheme] = useState<"light" | "dark">("light");
  const router = useRouter();

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setCurrentTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  const handleNavigation = (path: string) => {
    router.push(path); 
    setIsMenuOpen(false); 
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between md:justify-end">
        <button
          className="md:hidden p-2 text-gray-900 dark:text-white focus:outline-none"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <CloseIcon className="h-8 w-8" /> : <MenuIcon className="h-8 w-8" />}
        </button>

        <nav
          className={`fixed bg-white dark:bg-gray-900 md:bg-transparent w-full md:w-auto md:relative md:flex md:space-x-6 shadow-lg md:shadow-none transition-all duration-300 ease-in-out z-10 ${
            isMenuOpen ? "top-16" : "-top-64 md:top-0"
          }`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0 text-gray-700 dark:text-white">
            {["Home", "Features", "About", "Contact"].map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleNavigation(item === "Home" ? "/" : `/${item.toLowerCase()}`)} 
                  className="block py-2 px-4 hover:text-yellow-400 transition"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={toggleTheme}
          className="ml-4 p-2 text-gray-700 dark:text-white transition hover:text-yellow-400"
          aria-label="Toggle Dark Mode"
        >
          {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
};

export default Menu;