"use client";

import { useEffect, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle(): React.JSX.Element {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;
      const stored = localStorage.getItem("repopulse_theme");
      let current: "light" | "dark" = "dark";
      if (stored === "light" || stored === "dark") {
        current = stored;
      } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        current = "light";
      }

      setTheme(current);
      setMounted(true);

      const root = document.documentElement;
      if (current === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("repopulse_theme", next);

    const root = document.documentElement;
    if (next === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [theme]);

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
      title={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
    >
      {mounted && theme === "dark" ? (
        <Sun size={17} className="text-amber-400 rotate-icon" aria-hidden="true" />
      ) : (
        <Moon size={17} className="text-amber-500 rotate-icon" aria-hidden="true" />
      )}
    </button>
  );
}
