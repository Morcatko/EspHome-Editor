'use client';
import { useEffect, useState } from "react";

export const useDarkTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleThemeChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    setIsDarkMode(darkModeMediaQuery.matches)

    darkModeMediaQuery.addEventListener("change", handleThemeChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  return isDarkMode;
}